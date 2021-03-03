'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('posts', {
      fields: ['lurkerPostId', 'userId'],
      type: 'unique',
      name: 'unique_constraint_lurker_post_id_user_id'
    })
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
