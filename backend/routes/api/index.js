// const router = require('express').Router();

// const apiRouter = require('./api');

// const sessionRouter = require('./session');
// router.use('/session', sessionRouter);


// router.use('/api', apiRouter);


// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });


const express = require('express');
const router = express.Router();
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');

router.post('/users', async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


//Test Authentication Utilities
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

router.get('/set-token-cookie', async (req, res) => {
  const user = await User.findOne({ where: { username: 'Demo-lition' } });
  setTokenCookie(res, user);
  res.json({ user });
});

router.get('/restore-user', restoreUser, (req, res) => {
  res.json(req.user);
});

router.get('/require-auth', restoreUser, requireAuth, (req, res) => {
  res.json(req.user);
});



// validateSignup
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];



module.exports = router;


