const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: [true, 'Conversation id is required']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message