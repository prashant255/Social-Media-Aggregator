const Sequelize = require('sequelize')

const sequelize = new Sequelize('lurker', 'postgres', 'ps3dev', {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false
});

connectionStatus = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectionStatus()

module.exports = sequelize
global.sequelize = sequelize
