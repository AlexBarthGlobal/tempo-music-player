const isAuthLogin = async (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.redirect('/login')
    }
}

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).send('404 Request')
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.userType === 'ADMIN') next();
    else res.status(401).json({ msg: 'You are not an admin!'})
}

module.exports = {
    isAuthLogin,
    isAuth,
    isAdmin
}