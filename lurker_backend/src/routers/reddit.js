const express = require('express')
const router = new express.Router;
const redditAuth = require('../service/redditAuth')

router.get('/connect', (req, res) => {
    redditAuth.authorizeUser(req, res);
});

router.get('/callback', (req, res) => {
    res.send('Hello!');
    
    // TODO: Add in try catch
    const code = res.req.query.code;

    redditAuth.redditCallback(code)
        .then(response => {
            // TODO: Add to Refresh Token and Access Token to DB

            // refresh token is response.refresh_token
            // access token is response.access_token
            
        }).catch(e => {
            
        });
});

/*
// Refer for refresh token

redditAuth.getRefreshedAccessToken("10902378528-Dh1ikILCv5vUhZohB6jR31viGzAiZw")
    .then(accessToken => {
        console.log("Token : ", accessToken);
    }).catch(e => {
        console.log(e);
    });
*/

module.exports = router