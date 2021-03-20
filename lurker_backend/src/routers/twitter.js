const express = require('express')
const router = new express.Router
const twitterAuth = require('../service/twitterAuth')
const authenticateUser = require('../authentication/authMiddleware')
const twitterPosts = require('../service/twitterPosts')

router.get('/connect', (req, res) => {
    twitterAuth.sessionConnect(req, res)
  });

router.get('/callback', (req, res) => {
    twitterAuth.twitterCallback(req, res)
});

router.post('/callback', authenticateUser, async (req, res) => {
  try{
      await twitterAuth.saveToken(req.user.id, req.body);
      res.send()
  } catch({message}) {
      errorHandler(message, res)
  }
})

router.post('/allPosts/:userId', async (req, res) => {
  try{
      twitterPosts.getAllPosts(req.params.userId)
      res.send()
  } catch(e){
      res.status(500).send(e.message)
  }
})

module.exports = router
