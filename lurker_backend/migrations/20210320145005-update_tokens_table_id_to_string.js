'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('tokens', 'facebookUserId', {
      type: Sequelize.STRING(20),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {

  }
};
