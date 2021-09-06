const db = require('./database');
const Song = require('./models/song')
const User = require('./models/user')
const Collection = require('./models/collection')
const CollectionSession = require('./models/collectionSession');
const SessionSong = require('./models/sessionSongs')
const Listened = require('./models/listened');

User.hasMany(CollectionSession);
CollectionSession.belongsTo(User);

Collection.hasMany(CollectionSession);
CollectionSession.belongsTo(Collection);

User.belongsToMany(Collection, {through: 'userCollection'});
Collection.belongsToMany(User, {through: 'userCollection'});

Collection.belongsToMany(Song, {through: 'collectionSongs'})
Song.belongsToMany(Collection, {through: 'collectionSongs'})

User.hasOne(Listened);
Listened.belongsTo(User);

Listened.belongsToMany(Song, {through: 'listenedSongs'})
Song.belongsToMany(Listened, {through: 'listenedSongs'})

CollectionSession.belongsToMany(Song, {through: SessionSong})
Song.belongsToMany(CollectionSession, {through: SessionSong})

module.exports = {
    db,
    Song,
    User,
    Collection,
    CollectionSession,
    Listened,
    SessionSong
}