const oauth = require('oauth');
const Token = require('../models/tokens')
const common = require('../common')
const { QueryTypes } = require('sequelize')

consumer = () => {
    return new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, "1.0A", "http://localhost:8080/api/twitter/callback", "HMAC-SHA1");   
}

sessionConnect = (req, res) => {
    consumer().getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
        if(error)
            console.error(error)
        else{
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+oauthToken);
        }
    });
}

twitterCallback = (req, res) => {
    // console.log(oauthToken)
    consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {    //   console.log(oauthToken)
        if (error) {
        res.status(500).send("Error getting OAuth access token : " + error);
      } else {
        //TODO: Add this token to the databases
        console.log("OAuth Request Token: " + oauthAccessToken) //Access token
        console.log("Secret: " + oauthAccessTokenSecret) //Access token secret
        console.log("Verifier: " + req.query.oauth_verifier)

        const endpoint = "http://localhost:3000/callback/twitter"
        const params = {
            twitterAccessToken: oauthAccessToken,
            twitterAccessTokenPwd: oauthAccessTokenSecret
        }
        const url = endpoint + common.formatParams(params)
        
        res.redirect(url)
      }
    });
}

const twitterRequest = (oauthAccessToken, oauthAccessTokenSecret, url) => {
    console.log("Oauth Access Token", oauthAccessToken)
    console.log("Oauth Secret", oauthAccessTokenSecret)
    console.log(url)
    return new Promise((resolve, reject) => {
        consumer().get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data, response) => {
            if (error) {
                console.log(error)
                reject(error)
                // res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
            } else {
                dataJSON = JSON.parse(data)
                resolve(dataJSON)
            }
        })  
    })
}

const twitterRequestPost = (oauthAccessToken, oauthAccessTokenSecret, url) => {

    return new Promise((resolve, reject) => {
        consumer().post(url, oauthAccessToken, oauthAccessTokenSecret, {}, (error, data, response) => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                dataJSON = JSON.parse(data)
                resolve(dataJSON)
            }
        })  
    })
}

const saveToken = async (userId, {twitterAccessToken, twitterAccessTokenPwd}) => {

    if(twitterAccessToken === undefined || twitterAccessTokenPwd === undefined)
        throw new Error(JSON.stringify(error.BAD_REQUEST))

    try{
        await Token.upsert({
            userId,
            twitterAccessToken,
            twitterAccessTokenPwd
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
        if(!token || token.twitterAccessToken === null)
            throw new Error('No account to unlink');
        await Token.upsert({
            userId,
            twitterAccessToken: null,
            twitterAccessTokenPwd: null,
            twitterAnchorId: null
        }, { transaction: t})
        //Delete all the posts associated with reddit
        let query = 'delete from posts where "lurkerPostId" in (select id  from posts inner join post_details on posts."lurkerPostId"= post_details.id where handle = :handle and "userId" = :userId) and "userId" = :userId;'
        await sequelize.query(query, 
        { 
            replacements: { 
                handle: common.HANDLES.TWITTER,
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
    sessionConnect,
    twitterRequestPost,
    twitterCallback,
    twitterRequest,
    saveToken,
    unlinkAccount
}
