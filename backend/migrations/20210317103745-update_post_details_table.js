'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('post_details', 'category', {
      type: Sequelize.STRING(25),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('post_details', 'category')
  }
};
