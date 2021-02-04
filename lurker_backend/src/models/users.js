const Sequelize = require('sequelize')

module.exports = sequelize.define("users", {

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
    }
})