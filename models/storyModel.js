const mongoose = require('mongoose')

const storySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please enter user id']
    },
    text: {
        type: String,
        required: [true, 'Please provide story description'],
        trim: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        expires: 24 * 60 * 60
    }
})

const Story = mongoose.model('Story', storySchema)

module.exports = Story