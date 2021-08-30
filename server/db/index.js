const db = require('./database');
const Song = require('./models/song')
const User = require('./models/user')
const Collection = require('./models/collection')
const CollectionSession = require('./models/collectionSession')

User.hasMany(Collection)
// Collection.belongsToMany(User)

User.hasMany(CollectionSession) // {through: Collection}
CollectionSession.belongsTo(User) // {through: Collection}

Collection.hasMany(Song)
// Song.belongsToMany(Collection)


module.exports = {
    db,
    Song,
    User,
    Collection,
    CollectionSession
}