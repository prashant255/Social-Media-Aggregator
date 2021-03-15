const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = new XMLHttpRequest(); 
const common = require('../common')
const Token = require('../models/tokens')
const error = require('../error')
const axios = require('axios')

authorizeUser = (req, res) => {

        const endpoint = "https://www.reddit.com/api/v1/authorize";
        const params = {
            client_id:process.env.REDDIT_CLIENT_ID,
            response_type:"code",
            state:process.env.REDDIT_STATE,
            redirect_uri:"http://localhost:3000/callback/reddit",
            // redirect_uri:"http://localhost:3000/callback/reddit",
            duration:"permanent",
            scope:"read"
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
    
    // return new Promise((resolve, reject) => {
    //     const redirectUri = "http://localhost:8080/api/reddit/callback";
    //     const url = "https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirectUri;
    //     const base64Auth = getBase64Auth();   
        
    //     request.open("POST", url, true);
    //     request.setRequestHeader('Authorization','Basic ' + base64Auth);
    //     request.setRequestHeader("Content-type", "application/json");

    //     request.send();

    //     request.onreadystatechange = () => {
    //         if (request.readyState == request.DONE) {
    //             const response = JSON.parse(request.responseText);

    //             if(request.status == 200){
    //                 resolve(response);
    //             }else{
    //                 console.log("ERROR: ", response);
    //                 reject(response);
    //             }
    //         }
    //     }

    //     request.onerror = (e) => {
    //         // TODO: Mostly no error till this point, but you never know
    //         console.log("ERR: ",e);
    //         reject({
    //             message: e,
    //             error: request.status
    //         });
    //     }
    // });
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

const saveToken = async (userId, {redditRefreshToken, redditAccessToken}) => {
    
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

module.exports = {
    authorizeUser,
    redditCallback,
    getRefreshedAccessToken,
    saveToken
}

