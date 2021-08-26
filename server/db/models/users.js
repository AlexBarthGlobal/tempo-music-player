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
    hash: {
        type: Sequelize.STRING,
    },
    salt: {
        type: Sequelize.STRING
    },
    userType: {
        type: Sequelize.ENUM('USER', 'CREATOR', 'ADMIN'),
        defaultValue: 'USER',
        allowNull: false
    }
});