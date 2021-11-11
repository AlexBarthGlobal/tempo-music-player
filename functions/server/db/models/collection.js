const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('collections', {
    collectionName: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
    },
    collectionOwner: {
        type: Sequelize.SMALLINT,
        // allowNull: true
    },
    totalTime: {
        type: Sequelize.SMALLINT,
        defaultValue:0
    },
    collectionArtUrl: {
        type: Sequelize.TEXT,
        defaultValue: 'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/blackbox.jpg'
    }
});