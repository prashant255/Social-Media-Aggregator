const express = require('express')
const router = new express.Router
const bookmarks = require('../service/bookmarks')
const authenticateUser = require('../authentication/authMiddleware')

router.post('/:postId', authenticateUser, async (req, res) => {
    try{
        bookmark = await bookmarks.changeBookmark(req.user.id, req.params.postId)
        res.send(bookmark)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/all/:offset', authenticateUser, async (req, res) => {
    try{
        posts = await bookmarks.getAllBookmarkedPost(req.user.id, req.params.offset)
        res.send(posts)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/:category/:offset', authenticateUser, async (req, res) => {
    try{
        posts = await bookmarks.getBookmarkedPostByCategory(req.user.id, req.params.offset, req.params.category)
        res.send(posts)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router