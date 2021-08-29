const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('collectionSessions', {
    currBPM: {
        type: Sequelize.SMALLINT,
    },
    currColor: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue:1,
    },
    playIdx: {
        type: Sequelize.SMALLINT,
        defaultValue:0
    },
    playQueue: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[]
    },
    timeElapsed: {
        type: Sequelize.SMALLINT
    }
});