const express = require('express')
const {db} = require('./db');
const secrets = require('../secrets')
const passport = require('passport')
const crypto = require('crypto')
const api = require('./api')
const path = require('path')

const app = express();

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({db})

dbStore.sync(); //dbStore is only the Session table. The sessions on the server reset when the server is restarted if it is {force: true}

app.use(session({
  secret: secrets.sessionSecret,
  store: dbStore,
  resave: false,
  saveUninitialized: true,
  cookie: { // cookie lasts for 1 day
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')))

// -------------- Passport Authentication ---------------

require('./config/passport')

// ------------------------------------------------------

app.use('/api', api);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

//Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    res.send('<h1>There was an error, please try again.</h1>')
  }
});

app.listen(process.env.PORT || 8080);