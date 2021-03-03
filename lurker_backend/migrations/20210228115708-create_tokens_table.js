'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("tokens", {

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
    },
            
    createdAt: Sequelize.DATE,

    updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("tokens")
  }
};
