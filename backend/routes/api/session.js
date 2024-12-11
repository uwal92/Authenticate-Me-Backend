const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Login Route
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: { username: credential, email: credential }
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Login failed');
    err.status = 401;
    err.errors = { credential: 'Invalid credentials' };
    return next(err);
  }

  const safeUser = { id: user.id, email: user.email, username: user.username };

  await setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });
});

module.exports = router;
