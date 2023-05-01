const express = require('express');

const userController = require('../controllers/userController');

const expenseController = require('../controllers/expenseController');

const authenticatemiddleware = require('../middleware/auth')

const router = express.Router();

router.post('/signup-user', userController.signUp);

router.post('/login-user', userController.login);

router.get('/download', authenticatemiddleware.authenticate, expenseController.downloadExpense);



module.exports = router;