const User = require('./../models/userModel')
const Story = require('./../models/storyModel')
const CustomError = require('./../utils/CustomError')
const multer = require('multer')

const multerStoryImageStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'photos/story-images')
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req._id}-${Date.now()}.${ext}`)
    }
})

const storyImageUpload = multer({
    storage: multerStoryImageStorage
})

exports.storyImageUploadMiddleware = storyImageUpload.single('image')

exports.createStoryController = async (req,res,next) => {
    try{
        const text = req.body.text
        console.log(text)
        let image = ''
        if(req.file) image = req.file.filename
        const story = new Story({
            user: req._id,
            text,
            image
        })
        await story.save()
        res.status(200).json({
            status: 'success',
            data: {
                story
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getAllStoriesController = async (req,res,next) => {
    try{
        const user = await User.findById(req._id)
        const following = user.following
        const stories = await Story.find({user: {$in: following}}).populate('user', 'fullname username profilePicture')
        res.status(200).json({
            status: 'success',
            data: {
                stories
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getUserStoriesController = async (req,res,next) => {
    try{
        const stories = await Story.find({user: req._id}).populate('user', 'fullname username profilePicture')
        res.status(200).json({
            status: 'success',
            data: {
                stories
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteStoryController = async (req,res,next) => {
    console.log(req._id)
    const storyId = req.params.storyId
    try{
        const story = await Story.findOne({_id: storyId})
        if(story.user._id.toString() !== req._id) throw new CustomError('You can only delete your own story.', 400)
        await story.deleteOne()
        res.status(200).json({
            status: 'success',
            message: 'Story has been deleted'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}