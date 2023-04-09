const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup-user', userController.signUp);

router.get('/get-users', userController.signupDetails);

router.post('/login-user', userController.login);

module.exports = router;