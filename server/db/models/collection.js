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
    },
    collectionArtUrl: {
        type: Sequelize.TEXT,
        defaultValue: 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5ed6636cdd5d320006caf841%2FThe-Blackout-Tuesday-movement-is-causing-Instagram-feeds-to-turn-black-%2F960x0.jpg%3Ffit%3Dscale'
    }
});