const User = require('./../models/userModel')
const Post = require('./../models/postModel')
const Comment = require('./../models/commentModel')
const CustomError = require('./../utils/CustomError')
const multer = require('multer')

exports.getUserController = async (req,res,next) => {
    try{
        const user = await User.findById(req._id).select('-_id -__v')
        if(!user) throw new CustomError('User not found', 400)
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.updateUserController = async (req,res,next) => {
    try{
        const { username, email, password, fullname, bio } = req.body
        const updatedUser = await User.findByIdAndUpdate(req._id, {
            username,
            email,
            password,
            fullname,
            bio
        }, {
            new: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                updatedUser
            }
        })
    }
    catch(err){

    }
}

exports.followUserController = async (req,res,next) => {
    try{
        const userToFollowId = req.params.userId
        if(userToFollowId === req._id) throw new CustomError('You cannot follow yourself', 400)
        const userToFollow = await User.findOne({_id: userToFollowId})
        const loggedInUser = await User.findOne({_id: req._id})
        if(!userToFollow || !loggedInUser) throw new CustomError('User not found', 400)
        if(loggedInUser.following.includes(userToFollow._id)) throw new CustomError('You already follow this user', 400)
        loggedInUser.following.push(userToFollow._id)
        userToFollow.followers.push(loggedInUser._id)
        await loggedInUser.save()
        await userToFollow.save()
        res.status(200).json({
            status: 'success',
            message: 'You have followed this user'
        })
    }
    catch(err){
        if(err.name === 'CastError') err = new CustomError('Invalid user id', 400)
        next(err)
    }
}

exports.unfollowUserController = async (req,res,next) => {
    try{
        const userToUnfollowId = req.params.userId
        if(userToUnfollowId === req._id) throw new CustomError('You cannot unfollow yourself', 400)
        const userToUnfollow = await User.findOne({_id: userToUnfollowId})
        const loggedInUser = await User.findOne({_id: req._id})
        if(!userToUnfollow || !loggedInUser) throw new CustomError('User not found', 400)
        let index = loggedInUser.following.indexOf(userToUnfollow._id)
        if(index === -1) throw new CustomError('You do not follow this user', 400)
        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userToUnfollowId)
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req._id)
        await loggedInUser.save()
        await userToUnfollow.save()
        res.status(200).json({
            status: 'success',
            message: 'You have unfollowed this user'
        })
    }
    catch(err){
        if(err.name === 'CastError') err = new CustomError('Invalid user id', 400)
        next(err)
    }
}

exports.blockUserController = async (req,res,next) => {
    try{
        const userToBlockId = req.params.userId
        if(userToBlockId === req._id) throw new CustomError('You cannot block yourself', 400)
        const userToBlock = await User.findOne({_id: userToBlockId})
        const loggedInUser = await User.findOne({_id: req._id})
        if(!userToBlock || !loggedInUser) throw new CustomError('User not found', 400)
        if(loggedInUser.blocklist.includes(userToBlock._id)) throw new CustomError('You have already blocked this user', 400)
        loggedInUser.blocklist.push(userToBlock._id)
        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userToBlockId)
        userToBlock.followers = userToBlock.followers.filter(id => id.toString() !== req._id)
        await loggedInUser.save()
        await userToBlock.save()
        res.status(200).json({
            status: 'success',
            message: 'You have blocked this user'
        })
    }
    catch(err){
        if(err.name === 'CastError') err = new CustomError('Invalid user id', 400)
        next(err)
    }
}

exports.unblockUserController = async (req,res,next) => {
    try{
        const userToUnblockId = req.params.userId
        if(userToUnblockId === req._id) throw new CustomError('You cannot unblock yourself', 400)
        const userToUnblock = await User.findOne({_id: userToUnblockId})
        const loggedInUser = await User.findOne({_id: req._id})
        if(!userToUnblock || !loggedInUser) throw new CustomError('User not found', 400)
        let index = loggedInUser.blocklist.indexOf(userToUnblock._id)
        if(index === -1) throw new CustomError('You have not blocked this user', 400)
        loggedInUser.blocklist = loggedInUser.blocklist.filter(id => id.toString() !== userToUnblockId)
        loggedInUser.save()
        res.status(200).json({
            status: 'success',
            message: 'You have unblocked this user'
        })
    }
    catch(err){
        if(err.name === 'CastError') err = new CustomError('Invalid user id', 400)
        next(err)
    }
}

exports.getBlockedUsersController = async (req,res,next) => {
    try{
        const user = await User.findById(req._id).populate('blocklist', 'username fullname email')
        const {blocklist, ...data} = user
        res.status(200).json({
            status: 'success',
            data: {
                blocklist
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteUserController = async (req,res,next) => {
    try{
        const userToBeDeleted = await User.findById(req._id)
        await Comment.updateMany({'replies.likes': req._id}, {$pull: {'replies.$[].likes': req._id}})
        await Comment.updateMany({'replies.user': req._id}, {$pull: {replies: {user: req._id}}})
        await Comment.updateMany({likes: req._id}, {$pull: {likes: req._id}})
        const postsWithUserComments = await Post.find({}).populate('comments', 'user')
        postsWithUserComments.forEach(post => {
            post.comments = post.comments.filter(comment => comment.user.toString() !== req._id)
        })
        const promises = postsWithUserComments.map(post => post.save())
        await Promise.all(promises)
        await Comment.deleteMany({user: req._id})
        await Post.updateMany({likes: req._id}, {$pull: {likes: req._id}})
        const user = await User.findById(req._id).populate('posts', 'user')
        user.posts = user.posts.filter(user => user.user.toString() !== req._id)
        await user.save()
        await Post.deleteMany({user: req._id})
        await User.deleteOne({_id: req._id})
        res.status(200).json({
            status: 'success',
            message: 'User has been deleted'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.searchUserController = async(req,res,next) => {
    try{
        const searchParam = req.params.searchParam
        const users = await User.find({$or: [{username: {$regex: searchParam, $options: 'i'}}, {fullname: {$regex: searchParam, $options: 'i'}}]})
        console.log(users)
        res.status(200).json({
            status: 'message',
            data: {
                users
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

const multerPPStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'photos/profile-pictures')
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req._id}-${Date.now()}.${ext}`)
    }
})

const profilePictureUpload = multer({
    storage: multerPPStorage
})

exports.profilePictureUploadMiddleware = profilePictureUpload.single('profilePicture')

exports.uploadProfilePicture = async (req,res,next) => {
    try{
        if(!req.file) throw new CustomError('Please upload your profile picture', 400)
        const updatedUser = await User.findOneAndUpdate({_id: req._id}, {profilePicture: `${req.file.filename}`}, {new: true})
        res.status(200).json({
            status: 'success',
            message: 'Profile picture updated',
            data: {
                updatedUser
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

const multerCPStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'photos/cover-pictures')
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req._id}-${Date.now()}.${ext}`)
    }
})

const coverPictureUpload = multer({
    storage: multerCPStorage
})

exports.coverPictureUploadMiddleware = coverPictureUpload.single('coverPicture')

exports.uploadCoverPicture = async (req,res,next) => {
    try{
        if(!req.file) throw new CustomError('Please upload your cover picture', 400)
        const updatedUser = await User.findOneAndUpdate({_id: req._id}, {coverPicture: `${req.file.filename}`}, {new: true})
        res.status(200).json({
            status: 'success',
            message: 'Cover picture updated',
            data: {
                updatedUser
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}