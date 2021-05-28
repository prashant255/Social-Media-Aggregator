const express = require('express')
const router = new express.Router;
const redditAuth = require('../service/redditAuth')
const authenticateUser = require('../authentication/authMiddleware')
const redditPosts = require('../service/redditPosts');

router.get('/connect', (req, res) => {
    redditAuth.authorizeUser(req, res);
});

router.post('/unlink', authenticateUser, async (req, res) => {
    try{
        await redditAuth.unlinkAccount(req.user.id)
        res.send()
    } catch(e) {
        res.status(404).send(e.message)
    }
})

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
        await redditPosts.getAllPosts(req.params.userId)
        res.send()
    } catch(e){
        res.status(500).send(e.message)
    }
})

router.post('/refresh/:userId', (req, res) => {

    redditAuth.getRefreshedAccessToken(req.params.userId)
        .then(() => res.send('Updated Access Token'))
        .catch(e => {
            res.status(404).send(e);
        });
});

router.post('/vote', async(req,res) => {
    // try{
    //     const {id, dir} = req.body;
    //     console.log("id : ", id)
    //     console.log("dir : ", dir)

    //     await redditPosts.vote(id,dir);
    //     res.send();
    // } catch(e) {
    //     let statusCode=404
    //     if(e.status) statusCode=e.status

    //     res.status(statusCode).send(e);
    // }
    
    const {id, dir} = req.body;

    console.log('here3')
    redditPosts.vote(id,dir).then(() => {
        console.log('here2')
        res.send()
    }).catch(e => {
        let statusCode=404
        if(e.status) statusCode=e.status

        res.status(statusCode).send(e);
    })
});

router.get('/post/:postId', authenticateUser, async(req, res) => {
    try{
        const response = await redditPosts.getPostById(req.user.id, req.params.postId)
        res.send(response)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.get('/post/:postId/voteStatus', authenticateUser, async (req,res) => {
    try{
        const response = await redditPosts.getVoteStatus(req.user.id, req.params.postId)
        res.send(response)
    } catch(e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

module.exports = router