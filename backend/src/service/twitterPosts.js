'use strict';
const common = require('../common')
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')
const request = require('./twitterAuth')
const axios = require('axios')

const likePost = (userId, postId) => {
    const url = `https://api.twitter.com/1.1/favorites/create.json?id=${postId}`

    return new Promise((resolve, reject) => {

        Token.findOne({ where: { userId } }).then(tokens => {
            if (!tokens)
                reject('No Token');
            else if (!tokens.twitterAccessToken)
                reject('No Access Token')
            else if (!tokens.twitterAccessTokenPwd)
                reject('No Access Token Password')

            request.twitterRequestPost(tokens.twitterAccessToken, tokens.twitterAccessTokenPwd, url)
                .then(res => {
                    resolve();
                }).catch(e => reject(e));
        })
    })
}

const unlikePost = (userId, postId) => {
    const url = `https://api.twitter.com/1.1/favorites/destroy.json?id=${postId}`

    return new Promise((resolve, reject) => {

        Token.findOne({ where: { userId } }).then(tokens => {
            if (!tokens)
                reject('No Token');
            else if (!tokens.twitterAccessToken)
                reject('No Access Token')
            else if (!tokens.twitterAccessTokenPwd)
                reject('No Access Token Password')

            request.twitterRequestPost(tokens.twitterAccessToken, tokens.twitterAccessTokenPwd, url)
                .then(res => {
                    resolve();
                }).catch(e => reject(e));
        })
    })
}

const getPostById = async (userId, postId) => {
    let url = `https://api.twitter.com/1.1/statuses/show.json?id=${postId}&tweet_mode=extended`
    const tokens = await (Token.findOne({
        where: { userId }
    }))
    try {
        const postResponse = await request.twitterRequest(tokens.twitterAccessToken, tokens.twitterAccessTokenPwd, url)

        let images = []
        let videos = null
        if (postResponse.extended_entities !== undefined) {
            let mediaFromResponse = postResponse.extended_entities.media
            mediaFromResponse.forEach(media => {
                if (media.type === 'photo') {
                    images.push(media.media_url)
                } else if (media.type === 'video') {
                    videos = media.video_info.variants[0].url
                }
            })
        }
        const responseToSend = {
            senderName: postResponse.user.name,
            text: postResponse.full_text,
            createdAt: new Date(postResponse.created_at),
            senderImage: postResponse.user.profile_image_url,
            images,
            videos
        }
        return responseToSend
    } catch (e) {
        throw new Error(e.message)
    }
}

const getAllPosts = async (userId) => {
    const tokens = await (Token.findOne({
        where: { userId }
    }))
    const endpoint = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    const params = {
        exclude_replies: true,
        include_rts: false,
        trim_user: true,
        count: 20,
        tweet_mode: "extended",
        include_entities: false,
        //TODO: Change the limit in later stage of development to 100
    }

    if (tokens.twitterAnchorId !== null)
        params['since_id'] = tokens.twitterAnchorId
    const url = endpoint + common.formatParams(params);

    // return res;

    try {
        const response = await request.twitterRequest(tokens.twitterAccessToken, tokens.twitterAccessTokenPwd, url)
        response.map(async (post) => {
            const dbResponse = await PostDetails.findOrCreate({
                where: {
                    postId: post.id_str,
                    handle: common.HANDLES.TWITTER
                }
            })
            if (dbResponse[1]) {
                const rx = /https?:\/\/\S+/g
                const arr = post.full_text.match(rx).pop()
                // console.log(arr) //All the urls in array format
                let res = null;
                try {
                    console.log(post.id_str)
                    console.log(post.full_text.replace((rx), ""))
                    try {
                        res = await axios.post("http://localhost:5000/categorise", { text: post.full_text.replace((rx), "") })
                        PostDetails.update(
                            { category: res.data.category },
                            {
                                where: {
                                    postId: post.id_str,
                                    handle: common.HANDLES.TWITTER
                                }
                            })
                    } catch (e) {
                        console.log("Unable to fetch category")
                    }
                } catch (e) {
                    throw new Error(e.message)
                }
            }

            await Post.create({
                userId,
                lurkerPostId: dbResponse[0].dataValues.id
            })
        })

        if (response.length > 0) {
            await Token.update({
                twitterAnchorId: response[0].id
            }, { where: { userId } }
            )
        }
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    likePost,
    unlikePost,
    getAllPosts,
    getPostById
}