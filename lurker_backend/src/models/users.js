const Sequelize = require('sequelize')

module.exports = sequelize.define("users", {

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
    }
})