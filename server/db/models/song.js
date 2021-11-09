const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('songs', {
    songName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    artistName: {
        type: Sequelize.STRING
    },
    albumName: {
        type: Sequelize.STRING
    },
    BPM: {
        type: Sequelize.SMALLINT
    },
    duration: {
        type: Sequelize.SMALLINT
    },
    color: {
        type: Sequelize.STRING
    },
    songURL: {
        type: Sequelize.TEXT,
        // allowNull: false,
    },
    artURL: {
        type: Sequelize.TEXT,
        defaultValue: 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5ed6636cdd5d320006caf841%2FThe-Blackout-Tuesday-movement-is-causing-Instagram-feeds-to-turn-black-%2F960x0.jpg%3Ffit%3Dscale'
    },
    plays: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});