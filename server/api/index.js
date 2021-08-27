const router = require('express').Router();
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

router.get('/', (req, res, next) => {
    res.send('<h1>Hi</h1>')
})


module.exports = router;