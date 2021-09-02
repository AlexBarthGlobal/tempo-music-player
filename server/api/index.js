const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const {Song, User} = require('../db/index')

// router.get('/', (req, res, next) => {
//     res.send('<h1>Hi</h1>')
// })

router.post('/addSong', (req, res, next) => {
    const user = User.findOne({
        where: {
           email: req.email
        }
    });

    const song = Song.create({
        songName: 'Hi'
    });

    user.addSong(song);
})


module.exports = router;