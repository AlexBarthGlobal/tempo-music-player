const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('tempoRequests', {
    userId: {
        type: Sequelize.SMALLINT,
    },
    BPM: {
        type: Sequelize.SMALLINT,
    },
    collectionId: {
        type: Sequelize.SMALLINT
    }
});