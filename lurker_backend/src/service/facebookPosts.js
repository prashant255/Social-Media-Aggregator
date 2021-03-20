'use strict';

const common = require('../common')
const axios = require('axios');
const { response } = require('express');
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')

const getFriends = (accessToken, facebookUserId) => {
    return new Promise((resolve, reject) => {
        const endpoint = "https://graph.facebook.com/v9.0/" + facebookUserId + "/friends";
        const params = {
            access_token: accessToken
        }
        const url = endpoint + common.formatParams(params);

        axios.get(url).then(response => {
            resolve(response.data);
        }).catch(e => reject(e));
    });
}

const getAllPosts = async (userId) => {
    
    try{
        const token = await Token.findOne({where: { userId }});
        
        if(!token)
            throw new Error('Token not found');
        else if(!token.facebookUserId || !token.facebookAccessToken)
            throw new Error('No userId/token found for FB user');
            
        const {facebookAccessToken, facebookUserId} = token;
        const params = {
            access_token: facebookAccessToken
        }
        if(token.facebookAnchorId)
            params['since'] = token.facebookAnchorId;

        const friends = await getFriends(facebookAccessToken, facebookUserId);

        friends.data.map(async (friend) => {
            const endpoint = "https://graph.facebook.com/v9.0/"+ friend.id +"/feed";

            const url = endpoint + common.formatParams(params);
            axios.get(url).then(async(response) => {

                response.data.data.forEach(async (post) => {

                    const dbResponse = await PostDetails.findOrCreate({
                        where: {
                            postId: post.id,
                            handle: common.HANDLES.FACEBOOK
                        }
                    })
                    if (dbResponse[1]) {
                        //@TODO: Pass to ML pipeline
                        // console.log(element.name)
                        // console.log(element.title)
                        // console.log(element.selftext)
                        // if (element.post_hint === 'link')
                        //     console.log(element.url)
                    }

                    //New entry in Post table, wont add since it follows time stamp
                    await Post.create({
                        userId,
                        lurkerPostId: dbResponse[0].dataValues.id
                    })
                });

            }).catch(e => console.log(e));
        });

        // Update facebookAnchorId
        const now = Math.floor(Date.now()/1000).toString()
        await Token.upsert({
            userId,
            facebookAnchorId: now
        })
    } catch(e){
        throw new Error(e);
    }

}

module.exports = {
    getAllPosts
}