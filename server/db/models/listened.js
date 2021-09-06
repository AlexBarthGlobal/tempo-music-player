const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('listened', {
    timeListened: {
        type: Sequelize.SMALLINT,
        defaultValue:0
    },
});