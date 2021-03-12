const Sequelize = require('sequelize')

Categories = sequelize.define("categories", {

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    
    selectedCategory: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
    },

})
Categories.removeAttribute('id')

module.exports = Categories