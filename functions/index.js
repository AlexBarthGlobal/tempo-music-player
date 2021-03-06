const functions = require("firebase-functions");
const express = require('express')
const {db} = require('./server/db');
const secrets = require('./secrets')
const passport = require('passport')
const crypto = require('crypto')
const api = require('./server/api')
const auth = require('./server/api/auth')
const path = require('path')
const isAuth = require('./server/api/authMiddleware').isAuth;
const isAuthLogin = require('./server/api/authMiddleware').isAuthLogin;

const app = express();

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({db})

dbStore.sync(); //dbStore is only the Session table. The sessions on the server reset when the server is restarted if it is {force: true}

app.use(session({
  name: '__session',
  secret: secrets.sessionSecret,
  store: dbStore,
  resave: false,
  saveUninitialized: true,
  cookie: { // cookie lasts for 1 week
    maxAge: (1000 * 60 * 60 * 24)*7
  }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Middleware to serve static files


// app.use(isAuthLogin, express.static(path.join(__dirname, '../public')))

// -------------- Passport Authentication ---------------

require('./server/config/passport')
app.use(passport.initialize());
app.use(passport.session());

// ------------------------------------------------------

// app.use(function(req, res, next) {
//   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   next();
// });

app.use(function(req, res, next) {
  res.set('Cache-Control', 'private');
  next();
});

app.use(express.static(path.join(__dirname, './functions'), {
  index: "false"
}))

app.use('/login', (req, res) => {
  if (req.isAuthenticated()) res.redirect('/')
  else res.sendFile(path.join(__dirname, './index.html'))
})

app.use('/api', isAuthLogin, api);
app.use('/auth', auth)

app.use('*', isAuthLogin, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
});

app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    res.status(401).send('<h1>There was an error, please try again.</h1>')
  }
});

exports.app = functions.https.onRequest(app)