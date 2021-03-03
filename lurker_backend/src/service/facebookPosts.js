'use strict';

const common = require('../common')
const axios = require('axios');
const { response } = require('express');
// const PostDetails = require('../models/postDetails');
// const Token = require('../models/tokens');
// const Post = require('../models/posts')

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

const getAllPosts = async ({accessToken, facebookUserId}) => {
    
    try{
        const friends = await getFriends(accessToken, facebookUserId);

        friends.data.map(friend => {
            console.log(friend)

            const endpoint = "https://graph.facebook.com/v9.0/"+ friend.id +"/feed";
            const params = {
                access_token: accessToken //add timestamp
            }
            const url = endpoint + common.formatParams(params);
                
            axios.get(url).then(response => {
                // TODO: Add to DB    
                console.log(response.data);
                
            }).catch(e => console.error(e));
        });
    } catch(e){

    }

}

module.exports = {
    getAllPosts
}