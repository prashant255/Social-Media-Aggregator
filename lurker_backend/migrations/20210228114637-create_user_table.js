'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("users", {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },

      name: {
          type: Sequelize.STRING(50),
          allowNull: false,
      },

      email: {
          type: Sequelize.STRING(25),
          allowNull: false,
          unique: true,
          validate: {
              isEmail: true
          }
      },
      
      password: {
          type: Sequelize.STRING(72),
          allowNull: false
      },

      verificationEmailSentOn: {
          type: Sequelize.DATE
      }, 

      emailVerificationStatus: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      
      createdAt: Sequelize.DATE,

      updatedAt: Sequelize.DATE

    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("users")
  }
};
