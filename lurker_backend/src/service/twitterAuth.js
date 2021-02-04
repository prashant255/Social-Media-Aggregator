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
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+oauthToken);
        }
    });
}

twitterCallback = (req, res) => {
    consumer().getOAuthAccessToken(oauthToken, oauthTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.status(500).send("Error getting OAuth access token : " + error);
      } else {
        //TODO: Add this token to the databases
        console.log("OAuth Request Token: " + oauthAccessToken) //Access token
        console.log("Secret: " + oauthAccessTokenSecret) //Access token secret
        console.log("Verifier: " + req.query.oauth_verifier)
      }
    });
}

module.exports = {
    sessionConnect,
    twitterCallback
}
