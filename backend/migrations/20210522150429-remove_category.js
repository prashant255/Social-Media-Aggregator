'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('post_details', 'category')
  },

  down: async (queryInterface, Sequelize) => {
  }
};
