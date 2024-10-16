const User = require('./../models/userModel')
const CustomError = require('./../utils/CustomError')
const generateJWTtoken = require('./../utils/generateJWTtoken')

exports.registerController = async (req,res,next) => {
    try{
        const { username, password, email, fullname } = req.body
        const user = await User.findOne({$or: [{username}, {password}]})
        if(user) throw new CustomError('User already exists', 409)
        const newUser = new User({
            username,
            password,
            email,
            fullname
        })
        await newUser.save()
        const token = generateJWTtoken({id: newUser._id})
        res.cookie('token', token).status(201).json({
            status: 'success',
            token,
            data: {
                newUser
            }
        })
    }
    catch(err){
        next(err)
    }
}

exports.loginController = async (req,res,next) => {
    try{
        const { email, username, password } = req.body
        if(!email && !username) throw new CustomError('Please enter either username or email.', 400)
        if(!password) throw new CustomError('Please enter your password.', 400)
        let user
        if(username){
            user = await User.findOne({username}).select('+password')
        }
        else{
            user = await User.findOne({email}).select('+password')
        }
        if(!user) throw new CustomError('User does not exist.', 404)
        const isValidPassword = await user.comparePasswords(password, user.password)
        if(!isValidPassword) throw new CustomError('Password incorrect. Try again.', 401)
        const token = generateJWTtoken({id: user._id})
        res.cookie('token', token).status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        })
    }
    catch(err){
        next(err)
    }
}

exports.logoutController = async (req,res,next) => {
    res.clearCookie('token').status(200).json({
        status: 'success',
        message: 'You have been successfuly logged out'
    })
}