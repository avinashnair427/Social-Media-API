const CustomError = require('./../utils/CustomError')

const sendError = (err,req,res,next) => {
    if(err.isOperationalError){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else{
        res.status(500).json({
            status: 'fail',
            message: 'Something went very wrong', 
            err
        })
    }
}

const globalErrorHandler = (err,req,res,next) => {
    if(err.name === 'ValidationError'){
        err = new CustomError(err.message, 400)
    }
    
    sendError(err,req,res,next)
}

module.exports = globalErrorHandler