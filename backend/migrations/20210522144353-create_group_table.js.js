'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("groups", {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },

      embedding: {
          type: Sequelize.ARRAY(Sequelize.FLOAT(10)),
          allowNull: false
      },      
      
      category: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      
      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

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
