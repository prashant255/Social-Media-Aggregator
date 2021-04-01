const express = require('express')
const router = new express.Router
const posts = require('../service/posts')
const authenticateUser = require('../authentication/authMiddleware')

router.get('/all/:offset', authenticateUser, async (req, res) => {
    try{
        const response = await posts.getPostForUser(req.user.id, req.params.offset)
        res.send(response)
    } catch(e) {
        errorHandler(e.message)
    }
})
    
module.exports = router