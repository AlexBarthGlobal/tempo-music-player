const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const {Song, User, Collection, CollectionSession, Listened, SessionSong, ListenedSong, UserCollection} = require('../db/index');
const { Op } = require('Sequelize');

router.put('/clearSessions', async (req, res, next) => {
    try {
        await CollectionSession.destroy({
            where: {
                userId: req.session.passport.user
            }
        })

        res.status(200).send('Done')
    } catch (err) {
        next(err);
    }
});

router.put('/searchSongs', async (req, res, next) => {

    const searchInputAndBPMInput = {
        where: {    //searchInput and BPMInput are filled
            [Op.or]: [ 
                { 
                    songName: {
                        [Op.iLike]: `%${req.body.searchInput}%`
                    },
                },
                { 
                    artistName: {
                        [Op.iLike]: `%${req.body.searchInput}%`
                    }
                },
            ],
            [Op.and]: [
                {
                    BPM: {
                        [Op.gte]: req.body.BPMInput-2,
                         [Op.lte]: req.body.BPMInput+3
                    }
                }
            ]
        },
        limit: 15,
        order: [['plays', 'DESC']]
    };

    const searchInput = {
        where: { //Only searchInput is filled and no bpm is specified. BPMInput will be null in this scenario
            [Op.or]: [ 
                { 
                    songName: {
                        [Op.iLike]: `%${req.body.searchInput}%`
                    },
                },
                { 
                    artistName: {
                        [Op.iLike]: `%${req.body.searchInput}%`
                    }
                },
            ]
        },
        limit: 15,
        order: [['plays', 'DESC']]
    };

    const BPMInput = {where: {  //Only BPMInput is specified
        BPM: {
            [Op.gte]: req.body.BPMInput-2,
            [Op.lte]: req.body.BPMInput+3
        }
    }};

    const noInput = {   //Neither searchInput or BPMInput are specified, so simply query 15 most played songs.
        limit: 15,
        order: [['plays', 'DESC']]
    }

    try {
        let condition = req.body.searchInput && req.body.BPMInput ? searchInputAndBPMInput : req.body.searchInput ? searchInput : req.body.BPMInput ? BPMInput : noInput;
        const foundSongs = await Song.findAll(condition)
        res.json(foundSongs)
        
    } catch(err) {
        next(err)
    }
})

router.post('/shareCollection', async (req, res, next) => {
    try {
        const recipient = await User.findOne({
            where: {
                email: req.body.recipientEmail
            }
        });

        console.log('Blackberry', recipient.dataValues.id)

        if (!recipient) res.sendStatus(403) //Recipient doesn't exist

        //check if the user already has the collection

        const checkIfAlreadyHasCollection = await UserCollection.findOne({
            where: {
                userId: recipient.dataValues.id,
                collectionId: req.body.collectionId

            }
        });

        if (!checkIfAlreadyHasCollection) {
            const collectionToShare = await Collection.findByPk(req.body.collectionId)
            await recipient.addCollection(collectionToShare)
            res.status('201').send('Shared successfully.')
            console.log('Dog')
        } else {
            res.status('201').send('Recipient already has the collection.')
            console.log('Cat')
        };
    } catch (err) {
        next(err)
    }
})

router.put('/makeSingleSessionInactive', async (req, res, next) => {
    try {
        await CollectionSession.update(
            {active: false},
            {where: {
                id: req.body.data,
                userId: req.session.passport.user,
            }}
        );

        res.status(200).send('Done')
    } catch (err) {
        next(err)
    }
})

router.post('/createCollection', async (req, res, next) => {
    try {
        const newCollection = await Collection.create({
            collectionName: req.body.data.collectionName,
            collectionOwner: req.session.passport.user,
            collectionArtUrl: req.body.data.collectionArtURL || 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5ed6636cdd5d320006caf841%2FThe-Blackout-Tuesday-movement-is-causing-Instagram-feeds-to-turn-black-%2F960x0.jpg%3Ffit%3Dscale'
        })

        const user = await User.findByPk(req.session.passport.user);
        user.addCollection(newCollection);

        res.json(newCollection)
    } catch (err) {
        next(err)
    };
});

router.delete('/deleteCollection', async (req, res, next) => {
    try {
        await Collection.destroy({
            where: {
                id: req.body.collectionId
            }
        })

        res.status(200).send('Done')
    } catch(err) {
        next(err)
    }
})

router.put('/clearListened', async (req, res, next) => {
    try {
        await Listened.update(
            {timeListened: 0},
            {where: {
                userId: req.session.passport.user,
                id: req.body.data
            }}
        );

        await ListenedSong.destroy({
            where: {
                listenedId: req.body.data
            }
        });

        const listened = await Listened.findOne({
            where: {
                userId: req.session.passport.user,
                id: req.body.data
            }
        })

        res.json(listened);

    } catch (err) {
        next(err)
    };
})

router.post('/addSongToListenedAndSession', async (req, res, next) => {
    try {
        const song = await Song.findByPk(req.body.data.songId);
        const listened = await Listened.findOne({
            where: {
                userId: req.session.passport.user
            }
        });
        const session = await CollectionSession.findOne({
            where: {
                userId: req.session.passport.user,
                id: req.body.data.collectionSessionId
            }
        })

        await listened.addSong(song);
        await session.addSong(song);

        res.json('Done')
    } catch (err) {
        console.log(err)
    };
});

router.put('/incrementPlayIdx', async (req, res, next) => {
    try {
        await CollectionSession.increment('playIdx', {by: 1, where: {
            userId: req.session.passport.user,
            id: req.body.data
        }})

        res.status(200).send('Done')
    } catch (err) {
        console.log(err)
    }
})

router.put('/decrementPlayIdx', async (req, res, next) => {
    try {
        await CollectionSession.decrement('playIdx', {by: 1, where: {
            userId: req.session.passport.user,
            id: req.body.data
        }})

        res.status(200).send('Done')
    } catch (err) {
        console.log(err)
    }
})

router.put('/updateOrCreateSessionBpm', async (req, res, next) => {
    console.log('cherry', req.body.data.newBPM)
    try {
        const currentSession = await CollectionSession.findOne({
            where: {
                userId: req.session.passport.user,
                collectionId: req.body.data.selectedCollectionId
            },
        });

        console.log('cherries', currentSession)

        if (currentSession) {
            console.log('mango', req.body.data.newBPM)
            await CollectionSession.update(
                {currBPM: req.body.data.newBPM,
                active: true},
                {where: {
                    userId: req.session.passport.user,
                    collectionId: req.body.data.selectedCollectionId
                }}
            );
        } else {
            console.log('rari')
            const newSession = await CollectionSession.create({
                currBPM: req.body.data.newBPM
            });

            const user = await User.findByPk(req.session.passport.user);
            const collection = await Collection.findByPk(req.body.data.selectedCollectionId);

            await user.addCollectionSession(newSession);
            await collection.addCollectionSession(newSession);
        };

        res.status(200).send('Done')

    } catch (err) {
        console.log(err)
    }
})

router.post('/fetchCollectionSessionAndSessionSongs', async (req, res, next) => {
    try {
        const collectionSessionAndSessionSongs = await CollectionSession.findOne({
            where: {
                userId: req.session.passport.user,
                collectionId: req.body.data
            },
            include: {
                model: Song,
                required: false
            },
            order: [[Song, SessionSong, 'createdAt', 'ASC' ]]
        })

        res.json(collectionSessionAndSessionSongs)
    } catch (err) {
        next(err)
    }
})

router.post('/fetchCollectionAndCollectionSongsAndCollectionSessionAndSessionSongs', async (req, res, next) => {
    try {
        const collectionAndSongs = await User.findOne({
            where: {
                id: req.session.passport.user
            },
            include: {
                model: Collection,
                required: false,
                where: {
                    id: req.body.data
                },
                include: {
                    model: Song,
                    required: false,
                }
            },
            order: [
                [Collection, Song, 'BPM', 'ASC']
            ]
        });

        const sessionSongs = await CollectionSession.findOne({
            where: {
                collectionId: req.body.data,
                userId: req.session.passport.user
            },
            include: {
                model: Song,
                required: false,
            },
            order: [[Song, SessionSong, 'createdAt', 'ASC' ]]
        })

        res.json({
            collectionAndSongs: collectionAndSongs,
            sessionSongs: sessionSongs     
        });
    } catch (err) {
        console.log(err)
    };
})


router.put('/updateUserCollectionSessionsToInactive', async (req, res, next) => {
    try {
        // await CollectionSession.update({
        //     active: false,
        //     where: {
        //         userId: req.session.passport.user,
        //         id: {$not: req.body.data.collectionSessionId}
        //     }
        // });
        console.log('apple', req.body.data)
        await CollectionSession.update(
            {active: false},
            {where: {
                userId: req.session.passport.user,
                collectionId: {
                    [Op.not]: req.body.data
                }
            }}
        );

        res.status(201).send('Done')
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
                required: false,
                where: {
                    id: req.body.data
                },
                include: {
                    model: Song,
                    required: false,
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
});

router.post('/addSongToCollection', async (req, res, next) => {
    try {
        const collection = await Collection.findOne({
            where: {
                collectionOwner: req.session.passport.user,
                id: req.body.collectionId
            }
        });

        if (collection === null) res.status('403').send(`You don't own this collection or collection doesn't exist.`)

        const song = await Song.findByPk(req.body.songId);
        await collection.addSong(song);
        res.status('201').json(song);

    } catch (error) {
        next(error);
    };
});

router.delete('/removeSongFromCollection', async (req, res, next) => {
    console.log('MANGO', req.body.songId)
    try {
        const collection = await Collection.findOne({
            where: {
                collectionOwner: req.session.passport.user,
                id: req.body.collectionId
            }
        });

        if (collection === null) res.status('403').send(`You don't own this collection or collection doesn't exist.`)

        const song = await Song.findByPk(req.body.songId);
        await collection.removeSong(song)
        res.status('201').json(song)

    } catch (error) {
        next(error)
    };
});


module.exports = router;