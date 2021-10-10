const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('sessionSongs', {
    // id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // }
    // collectionSessionId: {
    //     type: Sequelize.INTEGER,
    //     unique: false
    // },
    // songId: {
    //     type: Sequelize.INTEGER,
    //     unique: false
    // }
});