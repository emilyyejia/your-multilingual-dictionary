const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Word = require('../models/word');
const Meaning = require('../models/meaning');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/unicorns'

// index action
// GET /unicorns
// Example of a non-protected route
router.get('/', (req, res) => {
  res.send('Haha');
});

// GET /unicorns/new
// Example of a protected route
router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a word!');
});

module.exports = router;