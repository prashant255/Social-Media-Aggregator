const express = require('express')
const router = new express.Router
const twitterAuth = require('../service/twitterAuth')
const authenticateUser = require('../authentication/authMiddleware')
const twitterPosts = require('../service/twitterPosts')

router.get('/connect', authenticateUser, (req, res) => {
    twitterAuth.sessionConnect(req, res)
  });

// router.get('/callback', (req, res) => {
//     twitterAuth.twitterCallback(req, res)
// });

router.post('/callback', authenticateUser, async (req, res) => {
  try{
      await twitterAuth.saveToken(req, res);
      res.send()
  } catch({message}) {
      errorHandler(message, res)
  }
})

router.post('/allPosts', authenticateUser, async (req, res) => {
  try{
      twitterPosts.getAllPosts(req.body, req.user.id)
      res.send()
  } catch(e){
      res.status(500).send(e.message)
  }
})

module.exports = router
