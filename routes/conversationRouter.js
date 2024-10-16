const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    createConversationController, 
    getConversationsOfUserController, 
    getBothUserConversations, 
    deleteConversationController } = require('./../controllers/conversationController')

const conversationRouter = express.Router()

conversationRouter.post('/create', verifyToken, createConversationController)
conversationRouter.get('/user', verifyToken, getConversationsOfUserController)
conversationRouter.get('/:secondUser', verifyToken, getBothUserConversations)
conversationRouter.delete('/:conversationId', verifyToken, deleteConversationController)

module.exports = conversationRouter