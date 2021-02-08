const express = require('express')
const router = new express.Router
const facebookAuth = require('../service/facebookAuth')
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

module.exports = router
