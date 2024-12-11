const router = require('express').Router();

const apiRouter = require('./api');

router.use('/api', apiRouter);


router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

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





module.exports = router;


