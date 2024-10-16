const Post = require('./../models/postModel')
const User = require('./../models/userModel')
const Comment = require('./../models/commentModel')
const CustomError = require('./../utils/CustomError')
const mongoose = require('mongoose')
const multer = require('multer')

exports.createPostController = async (req,res,next) => {
    try{
        const { caption } = req.body
        const user = await User.findOne({_id: req._id})
        if(!user) throw new CustomError('User does not exist', 400)
        const newPost = new Post({
            user: req._id,
            caption
        })
        await newPost.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(200).json({
            status: 'success',
            data: {
                newPost
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

const multerPostImagesStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'photos/post-images')
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req._id}-${Date.now()}.${ext}`)
    }
})

const postImagesUpload = multer({
    storage: multerPostImagesStorage
})

exports.postImagesUploadMiddleware = postImagesUpload.array('images', 5)

exports.createPostWithImageController = async (req,res,next) => {
    try{
        const { caption } = req.body
        const user = await User.findOne({_id: req._id})
        if(!user) throw new CustomError('User does not exist', 400)
        if(!req.files) throw new CustomError('Please upload post images', 400)
        const imageURLs = req.files.map(file => file.filename)
        const newPost = new Post({
            user: req._id,
            caption,
            images: imageURLs
        })
        await newPost.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(200).json({
            status: 'success',
            data: {
                newPost
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.updatePostController = async (req,res,next) => {
    try{
        const caption = req.body.caption
        const postId = req.params.postId
        const post = await Post.findOne({_id: postId})
        if(!post) throw new CustomError('Post not found', 400)
        if(caption) post.caption = caption
        post = await post.save()
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.getUserPostsController = async (req,res,next) => {
    try{
        const user = await User.findOne({_id: req._id}).populate('posts', 'caption images likes comments')
        if(!user) throw new CustomError('User does not exist', 400)
        const posts = user.posts
        res.status(200).json({
            status: 'success',
            data: {
                posts
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.likePostController = async (req,res,next) => {
    try{
        const postId = req.params.postId
        let post = await Post.findOne({_id: postId})
        if(!post) throw new CustomError('Post not found', 400)
        if(post.likes.includes(new mongoose.Types.ObjectId(req._id))) throw new CustomError('You already like this post', 400)
        post.likes.push(new mongoose.Types.ObjectId(req._id))
        await post.save()
        res.status(200).json({
            status: 'success',
            message: 'Post liked'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.unlikePostController = async (req,res,next) => {
    try{
        const postId = req.params.postId
        let post = await Post.findOne({_id: postId})
        if(!post) throw new CustomError('Post not found', 400)
        if(!post.likes.includes(new mongoose.Types.ObjectId(req._id))) throw new CustomError('You have not liked this post', 400)
        post.likes = post.likes.filter(id => id.toString() !== req._id)
        await post.save()
        res.status(200).json({
            status: 'success',
            message: 'You have unliked this post'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deletePostController = async (req,res,next) => {
    try{
        const postId = req.params.postId
        let post = await Post.findById(postId)
        if(!post) throw new CustomError('Post not found', 400)
        const user = await User.findById(req._id)
        user.posts = user.posts.filter(post => post.toString() !== postId)
        await post.deleteOne()
        await Comment.deleteMany({post: postId})
        res.status(200).json({
            status: 'success',
            message: 'Post has been deleted'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}