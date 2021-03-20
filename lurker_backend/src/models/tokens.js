const Sequelize = require('sequelize')

Tokens = sequelize.define("tokens", {

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
        
    twitterAccessToken: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },

    twitterAccessTokenPwd: {
        type: Sequelize.STRING(50),
        allowNull: true
    },

    twitterAnchorId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },

    facebookAccessToken: {
        type: Sequelize.STRING(255),
        allowNull: true
    },

    facebookAnchorId: {
        type: Sequelize.STRING(15),
        allowNull: true
    }

    redditRefreshToken: {
        type: Sequelize.STRING(255),
        allowNull: true
    },

    redditAccessToken: {
        type: Sequelize.STRING(255),
        allowNull: true
    },

    redditAnchorId: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    
})
Tokens.removeAttribute('id')

module.exports = Tokens