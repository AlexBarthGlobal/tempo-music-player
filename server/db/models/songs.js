const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('songs', {
    songName: {
        type: Sequelize.STRING,
    }
});