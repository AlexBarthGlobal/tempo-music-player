const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const {Song, User, Collection} = require('../db/index')

// router.get('/', (req, res, next) => {
//     res.send('<h1>Hi</h1>')
// })

// router.post('/addSong', (req, res, next) => {
//     const user = User.findOne({
//         where: {
//            email: req.email
//         }
//     });

//     const song = Song.create({
//         songName: 'Hi'
//     });

//     user.addSong(song);
// })

// router.get('/', (req, res, next) => {
//     res.send('Yo')
// })

router.post('/addsong', async (req, res, next) => {
    try {
        const song = await Song.create({
            songName: req.body.songName,
            artistName: req.body.artistName
        });
        res.json(song)
        
    } catch (err) {
        next(err)
    }
})

router.get('/findCollection', async (req, res, next) => {
    try {
        // const collections = Collection.findAll({
        //     where: {
        //         userId: req.body.userIdentification
        //     },
        //     include: {
        //         model: User,
        //         where: {
        //             userId: req.body.userIdentification
        //         }
        //     }
        // })

        // const collections = Collection.findAll({
        //     include: [{
        //         model: User,
        //         through: {
        //             attributes: ['collectionId'],
        //             where: {
        //                 userId: req.body.userIdentification
        //             }
        //         }
        //     }]
        // })

        const collections = Collection.findAll({
            through: {
                where: {
                    userId: req.body.userIdentification
                }
            }
        })

        res.json(collections)

    } catch (error) {
        next(error);
    }
})


module.exports = router;