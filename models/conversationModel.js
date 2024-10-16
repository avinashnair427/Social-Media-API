const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation