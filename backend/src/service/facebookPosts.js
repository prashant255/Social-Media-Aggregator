'use strict';

const common = require('../common')
const axios = require('axios');
const { response } = require('express');
const PostDetails = require('../models/postDetails');
const Token = require('../models/tokens');
const Post = require('../models/posts')
const { QueryTypes } = require('sequelize')

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

    try {
        const token = await Token.findOne({ where: { userId } });

        if (!token)
            throw new Error('Token not found');
        else if (!token.facebookUserId || !token.facebookAccessToken)
            throw new Error('No userId/token found for FB user');

        const { facebookAccessToken, facebookUserId } = token;
        const params = {
            access_token: facebookAccessToken,
            limit: 1
        }
        if (token.facebookAnchorId)
            params['since'] = token.facebookAnchorId;

        const friends = await getFriends(facebookAccessToken, facebookUserId);

        friends.data.map(async (friend) => {
            let groupId = null;
            const endpoint = "https://graph.facebook.com/v9.0/" + friend.id + "/feed";

            const url = endpoint + common.formatParams(params);
            axios.get(url).then(async (response) => {

                response.data.data.forEach(async (post) => {

                    const dbResponse = await PostDetails.findOrCreate({
                        where: {
                            postId: post.id,
                            handle: common.HANDLES.FACEBOOK
                        }
                    })

                    if (dbResponse[1]) {

                        let res = null;
                        let resDuplicate = null;
                        let text = post.message
                        if (!text)
                            text = "No text available"
                        res = await axios.post("http://localhost:5000/catnwe", { text })
                        let query = `select distinct(id), embedding from groups g inner join posts p on p."groupId" = g.id where p."userId" = :userId and category = :category`
                        const embeddings = await sequelize.query(query,
                            {
                                replacements: {
                                    category: res.data.category,
                                    userId
                                },
                                type: QueryTypes.SELECT
                            })

                        resDuplicate = await axios.post("http://localhost:5000/group", {
                            postEmbedding: res.data.embedding,
                            otherEmbedding: common.convertToFloat(embeddings)
                        })
                        groupId = resDuplicate.data.groupId;
                        if (groupId === -1) {
                            let resFromGroups = await Groups.create({
                                category: res.data.category,
                                embedding: res.data.embedding
                            })
                            groupId = resFromGroups.dataValues.id
                        }
                    } else {
                        let responseFromDb = await Post.findOne({
                            where: {
                                lurkerPostId: dbResponse[0].dataValues.id
                            },
                            attributes: ['groupId']
                        })
                        groupId = responseFromDb.dataValues.groupId
                    }

                    //New entry in Post table, wont add since it follows time stamp
                    await Post.create({
                        userId,
                        lurkerPostId: dbResponse[0].dataValues.id,
                        groupId
                    })
                });

                // Update facebookAnchorId
                if (response.data.data.length > 0) {

                    const now = Math.floor(Date.now()/1000).toString()
                    await Token.update({
                        facebookAnchorId: now
                    }, { where: { userId }
                    })
                }

            }).catch(e => console.log(e));
        });

    } catch (e) {
        throw new Error(e);
    }

}

const getUrl = (endpoint, params) => {
    return endpoint + common.formatParams(params)
}

const getPostById = async (userId, postId) => {

    try {

        let endpoint = `https://graph.facebook.com/v10.0/${postId}`
        let attachmentEndpoint = `${endpoint}/attachments`
        let nameEndpoint = `https://graph.facebook.com/v10.0/${postId.slice(0,15)}`
        let profilePictureEndpoint = `${nameEndpoint}/picture`

        const tokens = await (Token.findOne({
            where: { userId }
        }))
        const params = {
            access_token: tokens.facebookAccessToken
        }
        const postResponse = await axios.get(getUrl(endpoint, params))
        const attachmentResponse = await axios.get(getUrl(attachmentEndpoint, params))
        const nameResponse = await axios.get(getUrl(nameEndpoint, params))
        
        let images = []
        let videos = null
        if (attachmentResponse.data.data.length > 0) {

            let media = attachmentResponse.data.data[0]
            if(media.media.source) {
                videos = media.media.source
            } else if (media.subattachments) {
                media.subattachments.data.map(m => {
                        images.push(m.media.image.src)
                    })
            } else {
                let mediaFromResponse = media.media.image.src
                images.push(mediaFromResponse)
            }
        }

        const responseToSend = {
            senderName: nameResponse.data.name,
            text: postResponse.data.message,
            createdAt: new Date(postResponse.data.created_time),
            senderImage: getUrl(profilePictureEndpoint, params),
            images,
            videos
        }
        return responseToSend
    } catch (e) {
        throw new Error(e.message)
    }
} 

const getLikeStatus = async (userId, postId) => {
    // Voting convention similar to reddit is followed
    // 1 -> upvote
    // 0 -> no vote
    // NOTE: Even though string '1' or '0' is returned, the API actually gives a number

    let endpoint = `https://graph.facebook.com/v10.0/${postId}`
    try {
        const tokens = await (Token.findOne({
            where: { userId }
        }))
        const params = {
            access_token: tokens.facebookAccessToken,
            fields: 'reactions.summary(viewer_reaction)'
        }
        const url = endpoint + common.formatParams(params);
        const postResponse = await axios.get(url)
        let likeStatus = '0'
        if (postResponse.data.reactions.summary.viewer_reaction !== 'NONE')
            likeStatus = '1'
        console.log(likeStatus)
        return likeStatus

    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getPostById,
    getAllPosts,
    getLikeStatus
}