'use strict';

const express = require('express')
const router = new express.Router
const categories = require('../service/categories')
const authenticateUser = require('../authentication/authMiddleware')

router.get('/', authenticateUser, (req,res)=> {
    categories.getCategories(req.user.id)
    .then((categoryList) => res.send(categoryList))
    .catch(e => res.status(400).send(e))
})

router.post('/register', authenticateUser, (req,res) => {
    categories.registerCategories(req.user.id,req.body)
    .then(() => res.send('Categories updated for user'))
    .catch(e => res.status(400).send(e))
})

module.exports = router