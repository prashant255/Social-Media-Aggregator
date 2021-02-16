'use strict';
const common = require('../src/common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("post_details", {

      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },
          
      handle: {
          type: Sequelize.STRING(20),
          allowNull: false,
          validate: {
              isIn: [common.ALL_HANDLES]
          }
      },
  
      postId: {
          type: Sequelize.STRING(255),
          allowNull: false
      },
  
      category: {
          type: Sequelize.INTEGER,
          allowNull: true
      },

      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("posts")
  }
};
