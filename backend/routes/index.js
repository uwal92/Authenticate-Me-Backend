const express = require('express');
const router = express.Router();
const apiRouter = require('./api'); // Import the API router

// Connect API routes to `/api`
router.use('/api', apiRouter);

// Test route
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

module.exports = router;
