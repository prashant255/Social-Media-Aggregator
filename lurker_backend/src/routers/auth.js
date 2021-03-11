const express = require('express')
const router = new express.Router
const auth = require('../service/auth')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

router.post('/register', async (req, res) => {
    try {
        await auth.register(req.body)
        res.sendStatus(200)
    } catch({message}){
      errorHandler(message, res)
    }
});

router.post('/login', async (req, res) => {
  try {
    response = await auth.login(req.body)
    res.status(200).send(response)
  } catch({message}) {
    errorHandler(message, res)
  } 
})

router.get('/confirmation/:token', async (req, res) => {
  try {
      await auth.confirmEmail(req, res)
    } catch (e) {
      res.send('Verification Failed');
    }
  });

router.get('/status', async (req,res) => {
  try {
    const status = await auth.getSocialMediaLinkageStatus(req.user.id);
    res.status(200).send(status);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router