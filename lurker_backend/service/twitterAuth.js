const oauth = require('oauth');

consumer = () => {
    return new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, "1.0A", "http://localhost:8080/api/twitter/callback", "HMAC-SHA1");   
}

sessionConnect = (req, res) => {
    consumer().getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
        if(error)
            console.error(error)
        else{
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+oauthToken);
        }
    });
}

twitterCallback = (req, res) => {
    consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.status(500).send("Error getting OAuth access token : " + error);
      } else {
        // req.session.oauthAccessToken = oauthAccessToken;
        // req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        console.log("OAuth Request Token: " + oauthAccessToken) //Access token
        console.log("Secret: " + oauthAccessTokenSecret) //Access token secret
        console.log("Verifier: " + req.query.oauth_verifier)
        
        //TODO: Save the access token and access token secret in the database

        // Right here is where we would write out some nice user stuff
        // consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        //   if (error) {
        //       res.status(500).send("Error" + error)
        //   } else {
        //     dataJSON = JSON.parse(data)
        //     req.session.twitterScreenName = dataJSON.screen_name;    
        //     console.log(dataJSON.screen_name)
        //     res.send('You are signed in: ' + req.session.twitterScreenName)
        //   }  
        // });  
      }
    });
}

module.exports = {
    sessionConnect,
    twitterCallback
}
