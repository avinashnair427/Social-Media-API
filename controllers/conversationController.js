const CustomError = require('./../utils/CustomError')
const Conversation = require('./../models/conversationModel')
const Message = require('./../models/messageModel')

exports.createConversationController = async (req,res,next) => {
    try{
        const { firstUser, secondUser } = req.body
        if(!firstUser || !secondUser) throw new CustomError('All fields are required', 400)
        if(firstUser !== req._id) throw new CustomError('Only you can start a conversation with someone else', 400)
        let conversation = await new Conversation({participants: [firstUser,secondUser]})
        conversation = await conversation.save()
        res.status(200).json({
            status: 'success',
            data: {
                conversation
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getConversationsOfUserController = async (req,res,next) => {
    try{
        const conversations = await Conversation.find({participants: {$in: req._id}}).populate('participants', 'username fullname profilePicture')
        res.status(200).json({
            status: 'success',
            data: {
                conversations
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getBothUserConversations = async (req,res,next) => {
    try{
        const secondUser = req.params.secondUser
        const conversation = await Conversation.find({'participants.0': req._id, 'participants.1': secondUser}).populate('participants', 'username fullname profilePicture')
        res.status(200).json({
            status: 'success',
            data: {
                conversation
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteConversationController = async (req,res,next) => {
    try{
        const conversationId = req.params.conversationId
        const messages = Message.find({conversation_id: conversationId})
        await messages.deleteMany()
        await Conversation.findByIdAndDelete(conversationId)
        res.status(200).json({
            status: 'success',
            message: 'Conversation has been deleted'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}