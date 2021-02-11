const Sequelize = require('sequelize')

Tokens = sequelize.define("tokens", {

    userId: {
        type: Sequelize.INTEGER,
        allowNUll: false
    },
        
    twitterAccessToken: {
        type: Sequelize.STRING(50),
        allowNUll: true,
    },

    twitterAccessTokenPwd: {
        type: Sequelize.STRING(50),
        allowNUll: true,
    },

    facebookAccessToken: {
        type: Sequelize.STRING(255),
        allowNUll: true,
    },

    redditRefreshToken: {
        type: Sequelize.STRING(255),
        allowNUll: true,
    },

    redditAccessToken: {
        type: Sequelize.STRING(255),
        allowNUll: true,
    }
})
Tokens.removeAttribute('id')

module.exports = Tokens