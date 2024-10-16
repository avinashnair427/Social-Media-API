const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        select: false
    },
    fullname: {
        type: String,
        required: [true, 'Please enter your fullname'],
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    coverPicture: {
        type: String,
        default: ''
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blocklist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

userSchema.pre('save', async function(next){
    if(this.isModified('password') || this.isNew){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.comparePasswords = async (candidatePassword,actualPassword) => {
    return await bcrypt.compare(candidatePassword, actualPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User