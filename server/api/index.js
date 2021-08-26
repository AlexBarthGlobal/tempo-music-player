const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const connection = require('../db/database');
const User = require('../db/models/users')

router.post('/login', (req, res, next) => {})

router.post('/register', (req, res, next) => {})

router.get('/', (req, res, next) => {
    res.send('<p>Register<p>')
})

router.get('/login', (req, res, next) => {
    res.send('<p>Login<p>')
})

module.exports = router;