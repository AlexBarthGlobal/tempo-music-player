const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('collectionSessions', {
    currBPM: {
        type: Sequelize.SMALLINT,
    },
    // currColor: {
    //     type: Sequelize.STRING,
    // },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    playIdx: {
        type: Sequelize.SMALLINT,
        defaultValue:0
    },
    timeElapsed: {
        type: Sequelize.SMALLINT,
        defaultValue:0
    }
});