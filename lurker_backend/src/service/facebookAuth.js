const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = new XMLHttpRequest(); 
const common = require('../common')
const axios = require('axios')

const authorizeUser = (req, res) => {

    const endpoint = "https://www.facebook.com/v9.0/dialog/oauth";
    const params = {
        client_id: process.env.FACEBOOK_APP_ID,
        response_type: "code",
        redirect_uri: "http://localhost:8080/api/facebook/callback",
        state: 987654321
    }
    const url = endpoint +  common.formatParams(params);
    // res.send(url)
    res.redirect(url);
// https://www.facebook.com/v9.0/dialog/oauth?response_type=token&display=popup&client_id=919656592113173&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer%2Fcallback&auth_type=rerequest&scope=public_profile%2Cpages_read_user_content%2Cpages_show_list%2Cread_page_mailboxe   
}

const getAccessCode = (code) => {

    const endpoint = "https://graph.facebook.com/v9.0/oauth/access_token"
    const params = {
        redirect_uri: "http://localhost:8080/api/facebook/callback",
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code
    }
    const url = endpoint +  common.formatParams(params);
    axios.get(url).then(response => {
        console.log(response)
    })  

    //TODO: Save access token

}

module.exports = {
    authorizeUser,
    getAccessCode
}
