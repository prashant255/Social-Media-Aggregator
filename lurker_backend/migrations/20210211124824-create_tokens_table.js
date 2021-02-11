'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("tokens", {

      userId: {
          type: Sequelize.INTEGER,
          allowNUll: false,
          unique: true
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
      },
            
      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("tokens")
  }
};
