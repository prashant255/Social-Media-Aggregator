'use strict';
const common = require('../src/common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("posts", {

      userId: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
          
      lurkerPostId: {
          type: Sequelize.INTEGER,
          allowNull: false
      },

      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("posts")
  }
};
