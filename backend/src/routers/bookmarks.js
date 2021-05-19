const express = require('express')
const router = new express.Router
const bookmarks = require('../service/bookmarks')
const authenticateUser = require('../authentication/authMiddleware')

router.post('/:postId', authenticateUser, async (req, res) => {
    try{
        await bookmarks.changeBookmark(req.user.id, req.params.postId)
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


module.exports = router