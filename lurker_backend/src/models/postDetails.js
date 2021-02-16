const Sequelize = require('sequelize')
const common = require('../common')

module.exports = sequelize.define("post_details", {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
        
    handle: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            isIn: [common.ALL_HANDLES]
        }
    },

    postId: {
        type: Sequelize.STRING(255),
        allowNull: false
    },

    category: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true, 
            fields: ['postId', 'handle']
        }
    ]
})