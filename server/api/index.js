const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const {Song, User, Collection, CollectionSession, Listened, SessionSong} = require('../db/index');

// On metronome button Click after choosing BPM
router.get('/createOrUpdateCollectionSession', async (req, res, next) => {
    // req.body = {
    //     selectedBPM: 143,
    //     collectionId: 1,
    //     // user id is on the req.passport
    // }
    try {
        const prevCollectionSession = await CollectionSession.findOne({
            where: {
                userId: req.session.passport.user,
                collectionId: req.body.collectionId,
            },
            include: [{
                model: Song,
                required: false,
            }]
        });

        if (prevCollectionSession) {
            await prevCollectionSession.update({
                BPM: req.body.selectedBPM,
                active: true
            });

            res.json(prevCollectionSession);

        } else {
            const collectionSession = await CollectionSession.create({
                currBPM: req.body.selectedBPM
            });

            const user = await User.findByPk(req.session.passport.user);
            const collection = await Collection.findByPk(req.body.collectionId);

            await user.addCollectionSession(collectionSession);
            await collection.addCollectionSession(collectionSession);

            res.json(collectionSession);
        };
        throw Error;
    } catch (err) {
        console.log(err)
    };

})

router.put('/updateUserCollectionSessionsToInactive', async (req, res, next) => {
    try {
        await CollectionSession.update({
            active: false,
            where: {
                userId: req.session.passport.user,
                id: {$not: req.body.collectionSessionId}
            }
        });

        res.status(201)
    } catch (err) {
        console.log(err)
    }
})

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

router.post('/fetchCurrentCollectionAndSongs', async (req, res, next) => {
    try {
        // This is so only the user that actually has access to the collection may query it.
        // Verifies by their passport user.
        const collection = await User.findOne({
            where: {
                id: req.session.passport.user
            },
            include: {
                model: Collection,
                where: {
                    id: req.body.data
                },
                include: {
                    model: Song,
                }
            },
            order: [
                [Collection, Song, 'BPM', 'ASC']
            ]
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
                userId: req.session.passport.user
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
router.post('/fetchSongsFromSession', async (req, res, next) => {
    const collectionSessionId = req.body.data;
    
    try {
        const sessionSongs = await CollectionSession.findOne({
            where: {
                id: collectionSessionId,
                userId: req.session.passport.user
            },
            include: {
                model: Song,
                required: false,
            },
            order: [[Song, SessionSong, 'createdAt', 'ASC' ]]
            // order: [[Song, 'createdAt', 'ASC' ]]
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