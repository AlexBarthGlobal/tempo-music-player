const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../db/database');
const User = require('../db/models/users')

router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: 'login-success'}));

router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt
    })

    newUser.save()
    .then((user) => {
        console.log(user);
    });

    res.redirect('/login');
})

router.get('/', (req, res, next) => {
    res.send('<p>Register<p>')
})

router.get('/login', (req, res, next) => {
    res.send('<p>Login<p>')
})

module.exports = router;