const express = require('express')
const router = new express.Router
const categories = require('../service/settings/categories')
const deleteProfile = require('../service/settings/deleteProfile')
const authenticateUser = require('../authentication/authMiddleware')

router.post('/categories', authenticateUser, async (req, res) => {
    try{
        await categories.addSelectedCategories(req.body, req.user.id)
        res.send()
    } catch(e) {
        errorHandler(e.message, res)
    }
}) 

router.get('/categories', authenticateUser, async (req, res) => {
    try {
        let selectedCategories = await categories.getUserCategories(req.user.id)
        res.send(selectedCategories)
    } catch(e) {
        errorHandler(e.message, res)
    }
})

router.post('/deleteAccount', authenticateUser, async (req, res) => {
    try {
        await deleteProfile.deleteProfile(req.user.id)
        res.send()
    } catch (e) {
        console.log(e.message)
        errorHandler(e.message, res)
    }
})

module.exports = router