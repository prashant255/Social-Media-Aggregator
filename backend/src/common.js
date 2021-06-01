'use strict';

//Constants
const HANDLES = {
    FACEBOOK: 'Facebook',
    TWITTER: 'Twitter',
    REDDIT: 'Reddit'
}

const ALL_HANDLES = [
    HANDLES.FACEBOOK,
    HANDLES.TWITTER,
    HANDLES.REDDIT
]

//Functions
const formatParams = (params) => {
    return "?" + Object
        .keys(params)
        .map(function (key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}

const convertPostFormat = (posts) => {
    
    let res = []
    posts.map( ele => {
        let groupedPost = []
        ele["array_agg"].map( eleOfGroup => {
            groupedPost.push({
                "lurkerPostId": eleOfGroup[0],
                "postId": eleOfGroup[1],
                "handle": eleOfGroup[2],
                "bookmark": eleOfGroup[3]
            })
        })
        res.push(groupedPost)
    })
    return res;
}

module.exports = { 
    convertPostFormat,
    formatParams,
    ALL_HANDLES,
    HANDLES
}