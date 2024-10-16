const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Please provide post id']
    },
    text: {
        type: String,
        required: [true, 'Please enter your comment'],
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User id is required']
        },
        text: {
            type: String,
            required: [true, 'Please enter your reply']
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment