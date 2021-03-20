'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('tokens', 'facebookAnchorId', {
      type: Sequelize.STRING(15),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {

  }
};
