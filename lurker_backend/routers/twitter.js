const express = require('express')
const router = new express.Router
const twitterAuth = require('../service/twitterAuth')

router.get('/connect', (req, res) => {
    twitterAuth.sessionConnect(req, res)
  });

router.get('/callback', (req, res) => {
    twitterAuth.twitterCallback(req, res)
});

module.exports = router
