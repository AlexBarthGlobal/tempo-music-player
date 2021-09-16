const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../db/database');
const {Song, User, Collection, CollectionSession, Listened} = require('../db/index');
const isAuthLogin = require('./authMiddleware').isAuthLogin;

router.get('/me', async (req, res, next) => {
    try {
      // console.log(req.session)
      if (!req.session.passport.user) {
        res.sendStatus(401);
      } else {
        // const user = await User.findByPk(req.session.passport.user);
        const user = await User.findOne({
          where: {
            id: req.session.passport.user
          },
          include: {
            model: Listened,
            required: false,
            include: {
              model: Song,
              required: false
            }
          }
        });
        
        if (!user) {
          res.sendStatus(401);
        } else {
          res.json(user);
        }
      }
    } catch (error) {
      next(error);
    }
  });

// router.delete('/logout', (req, res, next) => {
//   req.logout()
//   req.session.destroy((err) => {
//     if (err) return next(err)
//     res.status(204).end();
//   })
// })

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}));

router.get('/', (req, res, next) => {
    res.redirect('/')
})

router.post('/register', async (req, res, next) => {
  try {

    const userExists = await User.findOne({
      where: {
        email: req.body.uname
      }
    });

    if (userExists !== null) {
      // res.redirect('/login');
      res.sendStatus(403)
      // throw new Error('Email already exists.')
    }

    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // const newUser = new User({
    //     email: req.body.uname,
    //     hash: hash,
    //     salt: salt
    // })

    // newUser.save()
    // .then((user) => {
    //     console.log(user);
    // });

    const newUser = await User.create({
      email: req.body.uname,
      hash: hash,
      salt: salt
    });

    const listened = await Listened.create()
    await newUser.setListened(listened)

    
    // Put any pre-made collections here

    // res.redirect('/');
    res.status(200).json('Registered')
  } catch (error) {
    next(error)
  }
})

// router.get('/login', (req, res, next) => {
//     res.send('<p>Login<p>')
// })

router.get('/logout', isAuthLogin, (req, res, next) => {
    req.logout();
    res.redirect('/login')
})

module.exports = router;