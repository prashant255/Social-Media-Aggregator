const express = require('express')
const router = new express.Router
const facebookAuth = require('../service/facebookAuth')
const facebookPosts = require('../service/facebookPosts')
const authenticateUser = require('../authentication/authMiddleware')

router.get('/connect', authenticateUser, (req, res) => {
    facebookAuth.authorizeUser(req, res)
    
});

router.get('/callback', (req, res) => {
    code = res.req.query.code
    // console.log(res)
    // console.log(code)
    // res.send("Test")
    facebookAuth.getAccessCode(code, res)
    res.send()
    // facebookAuth.facebookCallback(req, res)
});

router.post('/allPosts', async (req, res) => {

    try{
        facebookPosts.getAllPosts(req.body);
        res.send();
    } catch(e) {
        res.status(500).send(e.message);
    }
})

module.exports = router
