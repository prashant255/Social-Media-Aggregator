'use strict';
const common = require('../common')
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')
const request = require('./twitterAuth')
const axios = require('axios')

const getAllPosts = async ({accessToken, accessTokenPassword}, userId) => {
    const endpoint = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    const params = {
        exclude_replies: true,
        include_rts: false,
        trim_user: true,
        count: 10,
        tweet_mode: "extended",
        include_entities: false
          //TODO: Change the limit in later stage of development to 100
    }
    const url = endpoint + common.formatParams(params);
      
    // return res;

    try {
        const response = await request.twitterRequest(accessToken, accessTokenPassword, url)
        response.map(async (post) => {
            const dbResponse = await PostDetails.findOrCreate({
                where: {
                    postId: post.id_str,
                    handle: common.HANDLES.TWITTER
                }
            })  
            if(dbResponse[1]) {
                // console.log(post.id_str)
                const rx = /https?:\/\/\S+/g
                // const arr = post.full_text.match(rx).pop()
                // console.log(arr) //All the urls in array format
                let res = null;
                try {
                 res = await axios.post("http://localhost:5000", {text: post.full_text.replace((rx), "")})
                } catch (e) {
                    console.log(e)
                }
                console.log(post.full_text.replace((rx), ""))
                console.log(res.data)
            }

            await Post.create({
                userId,
                lurkerPostId: dbResponse[0].dataValues.id
            })
        })
        console.log(response.length)
        
        if(response.length > 0) {
            await Token.update({
                twitterAnchorId: response[0].id
            }, {where: { userId }}
            )
        }
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    getAllPosts
}