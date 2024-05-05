const express = require('express');
const {registerUser, signInUser, refreshToken} = require('../controllers/auth.controller');
const router = express.Router();

// Registration route
router.post('/sign-up', registerUser);

// Login route
router.post('/sign-in', signInUser);

// Refresh token route
router.post('/refresh-token', refreshToken);

module.exports = router;
