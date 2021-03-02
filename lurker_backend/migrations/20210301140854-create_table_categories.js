'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("categories", {

      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
      },
      
      selectedCategory: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false
      },

      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("categories")
  }
};
