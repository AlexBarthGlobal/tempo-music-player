const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../db/database');
const User = require('../db/models/user')

router.get('/me', async (req, res, next) => {
    try {
      // console.log(req.session)
      if (!req.session.passport.user) {
        res.sendStatus(401);
      } else {
        const user = await User.findByPk(req.session.passport.user);
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

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}));

router.get('/', (req, res, next) => {
    res.redirect('/')
})

router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        email: req.body.uname,
        hash: hash,
        salt: salt
    })

    newUser.save()
    .then((user) => {
        console.log(user);
    });

    res.redirect('/');
})

// router.get('/login', (req, res, next) => {
//     res.send('<p>Login<p>')
// })

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login')
})

module.exports = router;