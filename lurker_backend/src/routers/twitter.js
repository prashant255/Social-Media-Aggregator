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
	try {
		await twitterAuth.saveToken(req.user.id, req.body);
		res.send()
	} catch ({ message }) {
		errorHandler(message, res)
	}
})

router.post('/allPosts/:userId', async (req, res) => {
	try {
		twitterPosts.getAllPosts(req.params.userId)
		res.send()
	} catch (e) {
		res.status(500).send(e.message)
	}
})

router.get('/post/:postId', authenticateUser, async (req, res) => {
	try {
		const response = await twitterPosts.getPostById(req.user.id, req.params.postId)
		res.send(response)
	} catch (e) {
		res.status(500).send(e.message)
	}
})

router.post('/like/:postId', (req, res) => {
	twitterPosts.likePost(req.user.id, req.params.postId)
	.then(() => res.send())
	.catch(e => res.status(400).send(e))
})

router.post('/unlike/:postId',authenticateUser, (req, res) => {
	twitterPosts.unlikePost(req.user.id, req.params.postId)
	.then(() => res.send())
	.catch(e => res.status(400).send(e))
})

module.exports = router
