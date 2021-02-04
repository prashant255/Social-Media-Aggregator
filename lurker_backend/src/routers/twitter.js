const express = require('express')
const router = new express.Router
const twitterAuth = require('../service/twitterAuth')
const authenticateUser = require('../authentication/authMiddleware')

router.get('/connect', authenticateUser, (req, res) => {
    twitterAuth.sessionConnect(req, res)
  });

router.get('/callback', (req, res) => {
    twitterAuth.twitterCallback(req, res)
});

module.exports = router
