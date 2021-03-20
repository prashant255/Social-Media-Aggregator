const express = require('express')
const router = new express.Router;
const redditAuth = require('../service/redditAuth')
const authenticateUser = require('../authentication/authMiddleware')
const redditPosts = require('../service/redditPosts');

router.get('/connect', (req, res) => {
    redditAuth.authorizeUser(req, res);
});

router.post('/callback', authenticateUser, async (req, res) => {

    const { code } = req.body;

    try{
        const response = await redditAuth.redditCallback(code);

        if(response.refresh_token){
            const redditObj = {
                redditAccessToken: response.access_token,
                redditRefreshToken: response.refresh_token
            };
            redditAuth.saveToken(req.user.id, redditObj);
        }
        res.send();

    } catch(message) {
        // TODO: check?
        errorHandler(message, res)
    };
})

router.post('/allPosts/:userId', async (req, res) => {
    try{
        redditPosts.getAllPosts(req.params.userId)
        res.send()
    } catch(e){
        res.status(500).send(e.message)
    }
})

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