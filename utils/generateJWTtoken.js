const jwt = require('jsonwebtoken')

const generateJWTtoken = (idObject) => {
    return jwt.sign(idObject, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_TOKEN_EXPIRES_IN})
}

module.exports = generateJWTtoken