const db = require('./database');
const Song = require('./models/song')
const User = require('./models/user')
const Collection = require('./models/collection')
const CollectionSession = require('./models/collectionSession');

User.hasMany(CollectionSession);
CollectionSession.belongsTo(User);
Collection.hasMany(CollectionSession);
CollectionSession.belongsTo(Collection);

User.belongsToMany(Collection, {through: 'userCollection'});
Collection.belongsToMany(User, {through: 'userCollection'});

///

// Collection.belongsToMany(Song, {through: 'songViaCollection'})
// Song.belongsToMany(Collection, {through: 'songViaCollection'})

// Using userCollection as simply a table that contains all of the relationships between Users and Collections
// It contains only the PKs of Users and Collections, so it's low memory.

module.exports = {
    db,
    Song,
    User,
    Collection,
    CollectionSession
}