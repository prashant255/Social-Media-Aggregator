'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("users", {
      id: {
          type: Sequelize.INTEGER,
          allowNUll: false,
          autoIncrement: true,
          primaryKey: true,
      },

      name: {
          type: Sequelize.STRING(50),
          allowNUll: false,
      },

      email: {
          type: Sequelize.STRING(25),
          allowNUll: false,
          unique: true,
          validate: {
              isEmail: true
          }
      },
      
      password: {
          type: Sequelize.STRING(72),
          allowNUll: false
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
