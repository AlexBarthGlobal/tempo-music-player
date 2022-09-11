const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../db/database');
const {Song, User, Collection, CollectionSession, Listened} = require('../db/index');
const isAuthLogin = require('./authMiddleware').isAuthLogin;
const naivePw = require('../lib/naivePw')
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const EmailValidator = require("email-validator")

router.get('/', (req, res, next) => {
  res.redirect('/')
})

router.get('/me', async (req, res, next) => {
    try {
      if (!req.session.passport.user) {
        return res.status(401).json({error: 'User already exists.'})
      } else {
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
          return res.sendStatus(401);
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

    if (!EmailValidator.validate(req.body.uname) || req.body.uname.includes('@tempomusicplayer.io')) {
      return res.sendStatus(403);
    };

    const userExists = await User.findOne({
      where: {
        email: req.body.uname
      }
    });

    if (userExists) {
      return res.sendStatus(409);
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

    const emptyCollection = await Collection.create({
      collectionName: 'Add Songs here',
      collectionOwner: newUser.id
    })

    const beachChill = await Collection.findByPk(2)
    const turnUp = await Collection.findByPk(1)

    await newUser.addCollection(emptyCollection);
    await newUser.addCollection(beachChill);
    await newUser.addCollection(turnUp);

    next();

  } catch (error) {
    next(error)
  }
};

router.post('/enterAsGuest', registerGuest, /*clearInactiveGuests,*/ passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}))

async function registerGuest (req, res, next) {
  try {
    const mostRecentUser = await User.findOne({
      order: [[ 'createdAt', 'DESC' ]],
    });

    let mostRecentId;
    if (!mostRecentUser) {
      mostRecentId = 1;
    } else mostRecentId = mostRecentUser.id + 1;

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

    const emptyCollection = await Collection.create({
      collectionName: 'Add Songs here',
      collectionOwner: newUser.id
    })

    const beachChill = await Collection.findByPk(2)
    const turnUp = await Collection.findByPk(1)

    await newUser.addCollection(emptyCollection);
    await newUser.addCollection(beachChill);
    await newUser.addCollection(turnUp);

    const listened = await Listened.create()
    await newUser.setListened(listened)

    req.body.uname = newEmail;
    req.body.pw = naivePass;
    next();

  } catch (error) {
    next(error)
  };
};

// Use this logout route to delete guest after logout

// router.delete('/logoutGuest', async (req, res, next) => {
//   try {
//     await User.destroy({
//       where: {
//         id: req.session.passport.user,
//         userType: 'GUEST'
//       }
//     });
//     req.logout();
//     res.redirect('/login')
//   } catch (err) {
//     res.sendStatus(403)
//   };
// });


// Call this anytime someone enters as guest. Deletes guests with createdAt older than 3 days.

// async function clearInactiveGuests (req, res, next) {
//   try {
//     const threeDays = (86400000 * 3);
//     await User.destroy({
//       order: [['createdAt', 'ASC']],
//       where: {
//         userType: 'GUEST',
//         createdAt: {
//           [Op.lte]: new Date(Date.now() - threeDays)
//         }
//       }
//     });
//   next();

//   } catch (err) {
//     res.status(403)
//   }
// };

router.put('/upgradeToUser', async (req, res, next) => {
  try {

    if (!EmailValidator.validate(req.body.uname) || req.body.uname.includes('@tempomusicplayer.io')) res.sendStatus(403);

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

    const upgradedUser = await User.update({
      email: req.body.uname,
      hash: hash,
      salt: salt,
      userType: 'USER'
    },
    {
      where: {
        id: req.session.passport.user
      },
      returning: true,
      plain: true
    });

    res.status(201).send(upgradedUser)
  } catch (err) {
    next(err)
  };
});

router.put('/clearInitialLogin', async (req, res, next) => {
  try {
    const updatedUser = await User.update({
      initialLogin: false
    },
    {
      where: {
        id: req.session.passport.user
      }
    });
  res.status(201).json(updatedUser)
  } catch (err) {
    next(err)
  };
});

router.get('/logout', isAuthLogin, async (req, res, next) => {
  try {
    // await User.update({
    //   recentLogout: new Date()
    // },
    // {
    //   where: {
    //     id: req.session.passport.user
    //   }
    // });

    req.logout();
    res.redirect('/login')
  } catch (err) {
    next(err)
  };   
})

module.exports = router;