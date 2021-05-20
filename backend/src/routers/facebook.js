const express = require('express')
const router = new express.Router
const facebookAuth = require('../service/facebookAuth')
const facebookPosts = require('../service/facebookPosts')
const authenticateUser = require('../authentication/authMiddleware')

router.get('/connect', (req, res) => {
    facebookAuth.authorizeUser(req, res)
    
});

router.post('/callback', authenticateUser, (req, res) => {

    facebookAuth.getAccessCode(req.user.id, req.body).then(() => {
        res.send('Linked Facebook');
    }).catch(e => {
        console.error('Error : ', e);
        res.status(404).send(e);
    })
});

router.post('/allPosts/:userId', async (req, res) => {

    try{
        facebookPosts.getAllPosts(req.params.userId);
        res.send('Added FB posts');
    } catch(e) {
        res.status(500).send(e.message);
    }
})

module.exports = router