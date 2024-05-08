const express = require('express');
const {fetchUserData} = require('../controllers/profile.controller');
const {verifyToken}=require('../middleware/auth.middleware');
const router = express.Router();

router.get('/profile', verifyToken, fetchUserData);
module.exports = router;
