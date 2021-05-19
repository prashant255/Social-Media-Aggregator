'use strict';

const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../../config/config.json')[env]

const sequelize = new Sequelize(config.database, config.dialect, config.password, {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false
});

const connectionStatus = async () => {
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
