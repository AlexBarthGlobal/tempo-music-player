const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const {Song, User, Collection, CollectionSession, Listened} = require('../db/index');

router.get('/fetchCollectionAndSessions', async (req, res, next) => {

    try {
        const user = await User.findOne({
            where: {
                id: req.session.passport.user
            },
            include: [{
                model: Collection, 
                include: [{
                    model: CollectionSession,
                    required: false,
                    where: {
                        userId: req.session.passport.user
                    }
                }]
            }]
        });

        res.json(user);

    } catch(err) {
        console.log(err)
    }
})

router.get('/fetchSongsFromCollection', async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            where: {
                id: req.body.collectionId,
                //userId: req.passport.userId to make sure users can only query collections they have access to.
            },
            include: [Song]
        })

        res.json(collection);

    } catch (err) {
        console.log(err)
    }
})

router.get('fetchSongsFromListened', async (req, res, next) => {
    try {
        const listened = await Listened.findOne({
            where: {
                userId: req.passport.userId
            },
            include: [Song]
        })

        res.json(listened);

    } catch (err) {
        console.log(err)
    }
});

// Figure out how to fetch by date descending, so you have most recent songs first.
// This query should return the songs that you've listened from this session, in order.
router.get('fetchSongsFromSession', async (req, res, next) => {
    try {
        const sessionSongs = await CollectionSession.findOne({
            where: {
                userId: req.passport.userId
            },
            include: [Song]
        })

        res.json(sessionSongs);

    } catch (err) {
        console.log(err)
    }
})

router.post('/addsong', async (req, res, next) => {
    try {
        const song = await Song.create({
            songName: req.body.songName,
            artistName: req.body.artistName
        });

        res.json(song);

    } catch (err) {
        next(err)
    }
})












router.get('/findCollection', async (req, res, next) => {
    try {
        const collections = Collection.findAll({
            through: {
                where: {
                    userId: req.body.userIdentification
                }
            }
        })

        res.json(collections);

    } catch (error) {
        next(error);
    }
})


module.exports = router;