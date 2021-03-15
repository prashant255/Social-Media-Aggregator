'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("tokens", "twitterRequestToken", 
      {
          type: Sequelize.STRING(50),
          allowNull: true,
      }
    ),
    queryInterface.addColumn("tokens", "twitterRequestTokenSecret", 
      {
          type: Sequelize.STRING(50),
          allowNull: true,
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
