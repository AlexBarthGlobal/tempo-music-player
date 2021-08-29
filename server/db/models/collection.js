const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('collections', {
    collectionName: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
    },
    collectionOwner: {
        type: Sequelize.SMALLINT
    },
    totalTime: {
        type: Sequelize.SMALLINT
    }
});