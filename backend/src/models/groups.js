const Sequelize = require('sequelize')

Groups = sequelize.define("groups", {
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
    }
})

module.exports = Groups