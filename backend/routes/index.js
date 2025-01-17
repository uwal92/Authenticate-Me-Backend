const express = require('express');
const router = express.Router();
const apiRouter = require('./api'); // Import the API router

//const sessionRouter = require('./session.js');

// Connect API routes to `/api`
router.use('/api', apiRouter);

// Test route
// router.get('/hello/world', (req, res) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// backend/routes/index.js
// ...
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});
// ...

module.exports = router;
