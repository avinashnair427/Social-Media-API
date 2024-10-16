const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    createPostController, 
    createPostWithImageController, 
    updatePostController, 
    getUserPostsController, 
    likePostController, 
    unlikePostController, 
    deletePostController, 
    postImagesUploadMiddleware } = require('./../controllers/postController')

const postRouter = express.Router()

postRouter.post('/create', verifyToken, createPostController)
postRouter.post('/createWithImage', verifyToken, postImagesUploadMiddleware, createPostWithImageController)
postRouter.post('/update/:postId', verifyToken, updatePostController)
postRouter.get('/all', verifyToken, getUserPostsController)
postRouter.post('/like/:postId', verifyToken, likePostController)
postRouter.post('/unlike/:postId', verifyToken, unlikePostController)
postRouter.delete('/delete/:postId', verifyToken, deletePostController)

module.exports = postRouter