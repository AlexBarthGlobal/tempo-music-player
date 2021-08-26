module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).json({ msg: 'This is a protected resource'})
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.userType === 'ADMIN') next();
    else res.status(401).json({ msg: 'You are not an admin!'})
}