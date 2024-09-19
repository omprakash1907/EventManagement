const express = require('express');
const { register, login } = require('../controllers/authController');
const authRouter = express.Router();

//Register Route
authRouter.post('/register', register);

// Login route
authRouter.post('/login', login);

module.exports = authRouter;