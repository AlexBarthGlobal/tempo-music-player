const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('users', {
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
    }
});