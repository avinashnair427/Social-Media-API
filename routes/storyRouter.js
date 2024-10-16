const express = require('express')
const verifyToken = require('../utils/verifyToken')
const { 
    createStoryController, 
    getAllStoriesController, 
    getUserStoriesController, 
    deleteStoryController, 
    storyImageUploadMiddleware } = require('./../controllers/storyController')

const storyRouter = express.Router()

storyRouter.post('/create', verifyToken, storyImageUploadMiddleware, createStoryController)
storyRouter.get('/all', verifyToken, getAllStoriesController)
storyRouter.get('/user', verifyToken, getUserStoriesController)
storyRouter.delete('/delete/:storyId', verifyToken, deleteStoryController)

module.exports = storyRouter