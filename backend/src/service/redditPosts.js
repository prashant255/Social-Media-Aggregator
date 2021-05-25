// Assumption:- Max 100 post added per minute.
'use strict';
const axios = require('axios')
const request = require('request')

const common = require('../common')
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')

const getUrl = (imgUrl) => {
    let encoded = imgUrl.replace('amp;s', 's')
    let doubleEncoded = encoded.replace('amp;', '')
    let tripleEncoded = doubleEncoded.replace('amp;', '')
    return tripleEncoded
}

const getPostById = async (userId, postId) => {
    let url = `https://oauth.reddit.com/by_id/${postId}`
    const tokens = await(Token.findOne({
        where: {userId}
    }))
    const headers = {
        Authorization: 'Bearer ' + tokens.redditAccessToken
    }

    try{
        let postResponse = await axios.get(url, {
            headers
        })
        postResponse = postResponse.data.data.children[0].data
        url= `https://oauth.reddit.com/r/${postResponse.subreddit}/about`
        const subRedditResponse = await axios.get(url, {
            headers
        })

        let images = []
        if(postResponse.preview !== undefined) {
            let imagesFromResponse = postResponse.preview.images
            imagesFromResponse.forEach(element =>{
                images.push(getUrl(element.source.url))
            });
        } else if (postResponse.media_metadata !== undefined) {
            let imagesFromResponse = postResponse.media_metadata
            for(let key in imagesFromResponse) {
                images.push( getUrl(imagesFromResponse[key].s.u))
            }
        }

        let videos = null
        if(postResponse.secure_media !== undefined && postResponse.secure_media !== null) {
            videos = postResponse.secure_media.reddit_video.fallback_url
        }

        //TODO: Add logic to render video

        //Assumptions:
        //Only 1 video
        //Video and images are not together
        //2 formats of image rendering available

        const responseToSend = {
            senderName: postResponse.subreddit_name_prefixed,
            text: postResponse.selftext_html,
            createdAt: new Date(postResponse.created*1000),
            senderImage: subRedditResponse.data.data.icon_img,
            images,
            videos
        }
        return responseToSend
    } catch (e) {
        throw new Error(e.message)
    }
}

const getAllPosts = async (userId) => {
    const endpoint = "https://oauth.reddit.com/best";
    const tokens = await(Token.findOne({
        where: {userId}
    }))
    const params = {
        before: tokens.redditAnchorId,
        limit: 10  //TODO: Change the limit in later stage of development to 100
    }
    const url = endpoint + common.formatParams(params);
    try {
        const response = await axios.get(url, {
            headers: {
              Authorization: 'Bearer ' + tokens.redditAccessToken //the token is a variable which holds the token
            }
           })
        response.data.data.children.map(async (post) => {
            const element = post.data
            const dbResponse = await PostDetails.findOrCreate({
                where: {
                    postId: element.name,
                    handle: common.HANDLES.REDDIT
                }
            })
            if (dbResponse[1]) {
                //Pass to ML pipeline
                let res = null
                try {
                    console.log(element.name)
                    console.log(element.title)
                    console.log(element.selftext)
                    if (element.post_hint === 'link')
                        console.log(element.url)
                    try{
                        res = await axios.post("http://localhost:5000/categorise", {text: element.title + " " + element.selftext})    
                        PostDetails.update(
                            {category: res.data.category},
                            {
                                where: {
                                postId: element.name,
                                handle: common.HANDLES.REDDIT
                            }
                        })
                    }catch (e) {
                        console.log("Unable to fetch category")
                    } 
                    
                } catch (e) {
                    throw new Error(e.message)
                }
            }
            //New entry in Post table.
            await Post.create({
                userId,
                lurkerPostId: dbResponse[0].dataValues.id
            })

        })
        //Children[0] save as anchor id
        const count = response.data.data.dist 
        if (count > 0){
            await Token.update({
                redditAnchorId: response.data.data.children[0].data.name
            },
                { where: { userId } }
            )
        }
    } catch (e) {
        throw new Error(e)
    }

}

const vote = async (id, dir) => {
    return new Promise(async (resolve,reject) => {
        const USER_AGENT = 'Lurker App by (by /u/swapmarkh )';
        const tokens = await(Token.findOne({
            where: {userId: 1}
        }))
        const token = tokens.redditAccessToken

        request({
            method: 'POST',
            url: 'https://oauth.reddit.com/api/vote',
            headers: {
                'User-Agent': USER_AGENT,
                'Authorization': `bearer ${token}`
            },
            form: {
                id,
                dir
            }, json: false }, 
        function (error, response, body) {
            if (error)
                reject(error)
            else if (body.error) 
                reject(body.error)
            else
                resolve()
        });
    })
}

const getVoteStatus = async (userId, postId) => {
    try{
        const endpoint = `https://oauth.reddit.com/comments/${postId.slice(3)}/.json`;
        const tokens = await(Token.findOne({
            where: {userId}
        }))
        const headers = {
            Authorization: 'Bearer ' + tokens.redditAccessToken
        }
        const postResponses = await axios.get(endpoint, {
            headers
        })

        let voteStatus = null

        postResponses.data.map(post => {
            const kind = post.data.children[0].kind

            if(kind === 't3')
                voteStatus = post.data.children[0].data.likes
        })

        return voteStatus
    } catch(e) {
        throw new Error(e)
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    vote,
    getVoteStatus
}