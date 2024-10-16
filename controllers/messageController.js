const CustomError = require('./../utils/CustomError')
const Conversation = require('./../models/conversationModel')
const Message = require('./../models/messageModel')

exports.createMessageController = async (req,res,next) => {
    try{
        const { conversation_id, text } = req.body
        const sender = req._id
        let message = new Message({
            conversation_id,
            sender,
            text
        })
        message = await message.save()
        res.status(200).json({
            status: 'message',
            data: {
                message
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getMessagesController = async (req,res,next) => {
    try{
        const conversationId = req.params.conversationId
        const access = await Conversation.findOne({_id: conversationId, participants: {$in: req._id}})
        if(!access) throw new CustomError('You cannot get these conversations', 400)
        const messages = await Message.find({conversation_id: conversationId})
        res.status(200).json({
            status: 'success',
            data: {
                messages
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteMessageController = async (req,res,next) => {
    try{
        const messageId = req.params.messageId
        const message = await Message.findById(messageId)
        res.status(200).json({
            status: 'success',
            data: {
                message
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}