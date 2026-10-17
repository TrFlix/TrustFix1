const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration routes
router.post('/register/customer', authController.registerCustomer);
router.post('/register/provider', authController.registerProvider);

// Login route
router.post('/login', authController.login);

module.exports = router;
