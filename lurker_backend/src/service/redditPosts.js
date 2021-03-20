// Assumption:- Max 100 post added per minute.
'use strict';
const common = require('../common')
const axios = require('axios')
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')

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
                console.log(element.name)
                console.log(element.title)
                console.log(element.selftext)
                if (element.post_hint === 'link')
                    console.log(element.url)
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

module.exports = {
    getAllPosts
}