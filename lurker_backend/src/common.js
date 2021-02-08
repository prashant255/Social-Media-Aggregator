'use strict';

const formatParams = (params) => {
    return "?" + Object
        .keys(params)
        .map(function (key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}

module.exports = { 
    formatParams
}