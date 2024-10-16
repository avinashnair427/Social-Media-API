const jwt = require('jsonwebtoken')
const CustomError = require('./../utils/CustomError')

const verifyToken = (req,res,next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1]
        if(!token) throw new CustomError('You are not logged in', 404)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(decoded) req._id = decoded.id
        next()
    }
    catch(err){
        console.log(err)
        if(err.name === 'TokenExpiredError') err = new CustomError('Your token has expired', 404)
        next(err)
    }
}

module.exports = verifyToken