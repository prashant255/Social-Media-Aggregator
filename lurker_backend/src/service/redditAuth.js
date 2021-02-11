const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = new XMLHttpRequest(); 
const common = require('../common')
const Token = require('../models/tokens')
const error = require('../error')

// formatParams = (params) => {
//     return "?" + Object
//         .keys(params)
//         .map(function (key) {
//             return key + "=" + encodeURIComponent(params[key])
//         })
//         .join("&")
// }

authorizeUser = (req, res) => {

    const endpoint = "https://www.reddit.com/api/v1/authorize";
    const params = {
        client_id:process.env.REDDIT_CLIENT_ID,
        response_type:"code",
        state:process.env.REDDIT_STATE,
        redirect_uri:"http://localhost:8080/api/reddit/callback",
        duration:"permanent",
        scope:"identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote,wikiedit,wikiread"
    }
    const url = endpoint +  common.formatParams(params);
    res.redirect(url);
}

getBase64Auth = () => {
    return Buffer.from(process.env.REDDIT_CLIENT_ID + ":" + process.env.REDDIT_CLIENT_SECRET)
    .toString('base64');
}

redditCallback = (code) => {
    
    return new Promise((resolve, reject) => {
        const url = "https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=" + code + "&redirect_uri=http://localhost:8080/api/reddit/callback";
        request.open("POST", url, true);
        const base64Auth = getBase64Auth();    
        request.setRequestHeader('Authorization','Basic ' + base64Auth);
        request.setRequestHeader("Content-type", "application/json");

        request.send();

        request.onreadystatechange = () => {
            if (request.readyState == request.DONE) {
                const response = JSON.parse(request.responseText);

                if(request.status == 200){
                    resolve(response);
                }else{
                    reject(response);
                }
            }
        }

        request.onerror = (e) => {
            // TODO: Mostly no error till this point, but you never know
            reject({
                message: e,
                error: request.status
            });
        }
    });
}

getRefreshedAccessToken = (refreshToken) => {

    return new Promise((resolve, reject) => {
        const url = "https://www.reddit.com/api/v1/access_token?grant_type=refresh_token&refresh_token=" + refreshToken;
        request.open("POST", url, true);
        const base64Auth = getBase64Auth();
        request.setRequestHeader('Authorization','Basic ' + base64Auth);
        request.setRequestHeader("Content-type", "application/json");
        
        request.send();

        request.onreadystatechange = () => {
            if (request.readyState == request.DONE) {
                const response = JSON.parse(request.responseText);

                if(request.status == 200){
                    resolve(response.access_token);
                }else{
                    reject(response);
                }
            }
        }

        request.onerror = (e) => {
            // TODO: Mostly no error till this point, but you never know
            reject({
                message: e,
                error: request.status
            });
        }
    });
}

const saveToken = async (req, res) => {
    const {redditRefreshToken, redditAccessToken} = req.body
    

    if(redditAccessToken === undefined || redditRefreshToken === undefined)
        throw new Error(JSON.stringify(error.BAD_REQUEST))

    try{
        await Token.upsert({
            userId: req.user.id,
            redditAccessToken,
            redditRefreshToken
        })
        // if(await Token.findOne({where: {userId: req.user.id}}) !== null){
        //     await Token.update(
        //         { redditRefreshToken,
        //           redditAccessToken },
        //         { where: { userId: req.user.id } }
        //     )
        // }else{
        //     await Token.create({
        //         userId: req.user.id,
        //         redditRefreshToken,
        //         redditAccessToken
        //     })
        // }
    } catch (e) {
        throw new Error(e)
    }
    
}

module.exports = {
    authorizeUser,
    redditCallback,
    getRefreshedAccessToken,
    saveToken
}

