const express = require('express');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// CSRF Restore Route
router.get('/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken,
  });
});

// Test Authentication Utilities
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

// Signup Route
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
  handleValidationErrors,
];

router.post('/users', validateSignup, async (req, res, next) => {
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
