const Sequelize = require('sequelize')
const common = require('../common')

Posts = sequelize.define("posts", {

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
        
    lurkerPostId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    bookmark: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true, 
            fields: ['lurkerPostId', 'userId']
        }
    ]
})
Posts.removeAttribute('id')

module.exports = Posts