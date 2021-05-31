'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('groups', 'embedding', {
      type: Sequelize.ARRAY(Sequelize.DECIMAL),
      allowNull: false
  })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('groups', 'embedding')
  }
};