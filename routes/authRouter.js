const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    registerController, 
    loginController, 
    logoutController } = require('../controllers/authController')

const authRouter = express.Router()

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.post('/logout', logoutController)

module.exports = authRouter