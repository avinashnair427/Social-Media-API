const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    createCommentController, 
    createCommentReplyController, 
    updateCommentController, 
    updateCommentReplyController, 
    getCommentsByPostController, 
    deleteCommentReplyController, 
    likeCommentController, 
    unlikeCommentController, 
    likeCommentReplyController, 
    unlikeCommentReplyController, 
    deleteCommentController } = require('./../controllers/commentController')

const commentRouter = express.Router()

commentRouter.post('/create', verifyToken, createCommentController)
commentRouter.post('/create/reply/:commentId', verifyToken, createCommentReplyController)
commentRouter.post('/update/:commentId', verifyToken, updateCommentController)
commentRouter.post('/update/:commentId/replies/:replyId', verifyToken, updateCommentReplyController)
commentRouter.get('/post/:postId', verifyToken, getCommentsByPostController)
commentRouter.delete('/delete/:commentId/reply/:replyId', verifyToken, deleteCommentReplyController)
commentRouter.post('/like/:commentId', verifyToken, likeCommentController)
commentRouter.post('/unlike/:commentId', verifyToken, unlikeCommentController)
commentRouter.post('/reply/like/:commentId/:replyId', verifyToken, likeCommentReplyController)
commentRouter.post('/reply/unlike/:commentId/:replyId', verifyToken, unlikeCommentReplyController)
commentRouter.delete('/delete/:commentId', verifyToken, deleteCommentController)

module.exports = commentRouter