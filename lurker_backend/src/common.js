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

module.exports = { 
    formatParams,
    ALL_HANDLES,
    HANDLES
}