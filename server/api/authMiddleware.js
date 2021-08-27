module.exports.isAuthLogin = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.redirect('/login')
    }
}

module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).send('404 Request')
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.userType === 'ADMIN') next();
    else res.status(401).json({ msg: 'You are not an admin!'})
}