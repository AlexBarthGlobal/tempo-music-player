const db = require('./database');
const Song = require('./models/song')
const User = require('./models/user')
const Collection = require('./models/collection')
const CollectionSession = require('./models/collectionSession');
const SessionSong = require('./models/sessionSongs')
const Listened = require('./models/listened');
const ListenedSong = require('./models/listenedSong')
const UserCollection = require('./models/userCollection')
const TempoRequest = require('./models/tempoRequests')

User.hasMany(CollectionSession);
CollectionSession.belongsTo(User);

Collection.hasMany(CollectionSession);
CollectionSession.belongsTo(Collection);

User.belongsToMany(Collection, {through: UserCollection});
Collection.belongsToMany(User, {through: UserCollection});

Collection.belongsToMany(Song, {through: 'collectionSongs'})
Song.belongsToMany(Collection, {through: 'collectionSongs'})

User.hasOne(Listened);
Listened.belongsTo(User);

Listened.belongsToMany(Song, {through: ListenedSong})
Song.belongsToMany(Listened, {through: ListenedSong})

CollectionSession.belongsToMany(Song, {through: SessionSong})
Song.belongsToMany(CollectionSession, {through: SessionSong})

//When I re-do database, will be something like below:
// SessionSong.belongsTo(Song);
// Song.hasMany(SessionSong);

// SessionSong.belongsTo(CollectionSession);
// CollectionSession.hasMany(SessionSong);

module.exports = {
    db,
    Song,
    User,
    Collection,
    CollectionSession,
    Listened,
    SessionSong,
    ListenedSong,
    UserCollection,
    TempoRequest
}