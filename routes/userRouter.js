const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    getUserController, 
    updateUserController, 
    followUserController, 
    unfollowUserController, 
    blockUserController, 
    unblockUserController, 
    getBlockedUsersController, 
    deleteUserController, 
    searchUserController, 
    uploadProfilePicture, 
    uploadCoverPicture, 
    profilePictureUploadMiddleware, 
    coverPictureUploadMiddleware } = require('../controllers/userController')

const userRouter = express.Router()

userRouter.get('/getUser', verifyToken, getUserController)
userRouter.post('/updateUser', verifyToken, updateUserController)
userRouter.post('/follow/:userId', verifyToken, followUserController)
userRouter.post('/unfollow/:userId', verifyToken, unfollowUserController)
userRouter.post('/block/:userId', verifyToken, blockUserController)
userRouter.post('/unblock/:userId', verifyToken, unblockUserController)
userRouter.get('/blocked', verifyToken, getBlockedUsersController)
userRouter.delete('/deleteUser', verifyToken, deleteUserController)
userRouter.get('/search/:searchParam', verifyToken, searchUserController)
userRouter.post('/upload-profile-picture', verifyToken, profilePictureUploadMiddleware, uploadProfilePicture)
userRouter.post('/upload-cover-picture', verifyToken, coverPictureUploadMiddleware, uploadCoverPicture)

module.exports = userRouter