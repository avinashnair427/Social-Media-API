const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    createMessageController, 
    getMessagesController, 
    deleteMessageController } = require('./../controllers/messageController')

const messageRouter = express.Router()

messageRouter.post('/create', verifyToken, createMessageController)
messageRouter.get('/:conversationId', verifyToken, getMessagesController)
messageRouter.delete('/:messageId', verifyToken, deleteMessageController)

module.exports = messageRouter