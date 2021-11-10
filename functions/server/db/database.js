const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];

const db = new Sequelize(config.database, config.username, config.password, config);

module.exports = db;