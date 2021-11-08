const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../db/database');
const {Song, User, Collection, CollectionSession, Listened} = require('../db/index');
const isAuthLogin = require('./authMiddleware').isAuthLogin;
const naivePw = require('../lib/naivePw')
const Sequelize = require('sequelize');

router.get('/', (req, res, next) => {
  res.redirect('/')
})

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

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}));

router.post('/register', register, passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}));

async function register (req, res, next) {
  try {
    const userExists = await User.findOne({
      where: {
        email: req.body.uname
      }
    });

    if (userExists) {
      res.sendStatus(409)
    };

    const saltHash = genPassword(req.body.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = await User.create({
      email: req.body.uname,
      hash: hash,
      salt: salt
    });

    const listened = await Listened.create()
    await newUser.setListened(listened)

    // Put any pre-made collections here

    next();

  } catch (error) {
    next(error)
  }
};

router.post('/enterAsGuest', registerGuest, passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}))

async function registerGuest (req, res, next) {
  try {
    const mostRecentUser = await User.findOne({
      order: [[ 'createdAt', 'DESC' ]],
    });

    let mostRecentId;
    if (!mostRecentUser) {   // Write logic if there are no users for whatever reason.
      mostRecentId = 1;
    } else mostRecentId = mostRecentUser.id;

    const newEmail = 'user' + (mostRecentId+1337) + '@tempomusicplayer.io'
    const naivePass = naivePw(12)

    const saltHash = genPassword(naivePass);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = await User.create({
      email: newEmail,
      hash: hash,
      salt: salt,
      userType: 'GUEST'
    });

    const listened = await Listened.create()
    await newUser.setListened(listened)

    // Put any pre-made collections here

    req.body.uname = newEmail;
    req.body.pw = naivePass;
    next();

  } catch (error) {
    next(error)
  };
};

router.delete('/logoutGuest', async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.session.passport.user,
        userType: 'GUEST'
      }
    });
    req.logout();
    res.redirect('/login')
  } catch (err) {
    res.sendStatus(403)
  };
});

// Call this after Guest signs up
router.get('/clearInactiveGuests', async (req, res, next) => {
  const inactiveGuests = await User.findAll({
    // order: [[ 'createdAt', 'DESC' ]],
    where: {
      userType: 'GUEST'
    }
  });

  res.status(200).json(inactiveGuests)
})

router.put('/upgradeToUser', async (req, res, next) => {
  try {
    const userExists = await User.findOne({
      where: {
        email: req.body.uname
      }
    });
  
    if (userExists) {
      res.sendStatus(409)
    };

    const saltHash = genPassword(req.body.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    await User.update({
      email: req.body.uname,
      hash: hash,
      salt: salt,
      userType: 'USER'
    },
    {
      where: {
        id: req.session.passport.user
      }
    });

    res.status(200).send('You are now a user.')
  } catch (err) {
    next(err)
  };
});

router.get('/logout', isAuthLogin, (req, res, next) => {
    req.logout();
    res.redirect('/login')
})

module.exports = router;