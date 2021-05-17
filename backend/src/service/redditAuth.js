const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const common = require('../common')
const Token = require('../models/tokens')
const error = require('../error')
const axios = require('axios')
const { QueryTypes } = require('sequelize')

authorizeUser = (req, res) => {

        const endpoint = "https://www.reddit.com/api/v1/authorize";
        const params = {
            client_id:process.env.REDDIT_CLIENT_ID,
            response_type:"code",
            state:process.env.REDDIT_STATE,
            redirect_uri:"http://localhost:3000/callback/reddit",
            // redirect_uri:"http://localhost:3000/callback/reddit",
            duration:"permanent",
            scope:"read,vote"
        }
        const url = endpoint +  common.formatParams(params);
    res.redirect(url);
}

getBase64Auth = () => {
    return Buffer.from(process.env.REDDIT_CLIENT_ID + ":" + process.env.REDDIT_CLIENT_SECRET)
    .toString('base64');
}

redditCallback = (code) => {
    console.log("redditCallback");

    return new Promise( async (resolve, reject) => {
        const redirectUri = "http://localhost:3000/callback/reddit";
        const url = "https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirectUri;
        const base64Auth = getBase64Auth();    
        const headers = {
            "Authorization": 'Basic ' + base64Auth,
            "Content-type": 'application/json'
        };
        const body = {}
        console.log('time to start');
        await axios.post(url, body ,{headers}).then(response => {
            // console.log(response);
            resolve(response.data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
}

getRefreshedAccessToken = async (userId) => {
    try {
        const token = await Token.findOne({where: { userId }});
        
        if(!token)
            throw new Error('No token for user');
        else if(!token.redditRefreshToken)    
            throw new Error('No refresh token found');
        
        const refreshToken = token.redditRefreshToken;

        const url = `https://www.reddit.com/api/v1/access_token?grant_type=refresh_token&refresh_token=${refreshToken}`;
        const base64Auth = getBase64Auth();
        
        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Basic ${base64Auth}`
            }
        })
        await Token.upsert({
            userId, 
            redditAccessToken: response.data.access_token
        })
    } catch(e) {
        console.log(e)
        throw new Error(e)
    }
}

const saveToken = async (userId, {redditAccessToken, redditRefreshToken}) => {
    
    if(redditAccessToken === undefined || redditRefreshToken === undefined)
        throw new Error(JSON.stringify(error.BAD_REQUEST))
    try{
        await Token.upsert({
            userId,
            redditAccessToken,
            redditRefreshToken
        })
    } catch (e) {
        throw new Error(e)
    }
    
}

const unlinkAccount = async (userId) => {
    try{
        //Transaction is created to rollback in case account deletion fails.
        const t = await sequelize.transaction();
        const token = await Token.findOne({where: { userId }})
        if(!token || !token.redditRefreshToken)
            throw new Error('No account to unlink');
        await Token.upsert({
            userId,
            redditAccessToken: null,
            redditRefreshToken: null,
            redditAnchorId: null
        }, { transaction: t})
        //Delete all the posts associated with reddit
        let query = 'delete from posts where "lurkerPostId" in (select id  from posts inner join post_details on posts."lurkerPostId"= post_details.id where handle = :handle and "userId" = :userId) and "userId" = :userId;'
        await sequelize.query(query, 
        { 
            replacements: { 
                handle: common.HANDLES.REDDIT,
                userId
            },
            type: QueryTypes.DELETE 
        }, {transaction: t})
        
        await t.commit()
        
    } catch(e) {
        await t.rollback()
        throw new Error(e.message)
    } 
}

module.exports = {
    authorizeUser,
    redditCallback,
    getRefreshedAccessToken,
    saveToken,
    unlinkAccount
}

