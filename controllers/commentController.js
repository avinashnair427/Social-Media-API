const CustomError = require('./../utils/CustomError')
const Comment = require('./../models/commentModel')
const Post = require('./../models/postModel')
const User = require('./../models/userModel')

exports.createCommentController = async (req,res,next) => {
    try{
        const { postId, text } = req.body
        if(!postId || !text) throw new CustomError('All fields are required', 400)
        const userId = req._id
        const user = await User.findOne({_id: req._id})
        if(!user) throw new CustomError('User not found', 400)
        const post = await Post.findOne({_id: postId})
        if(!post) throw new CustomError('Post not found', 400)
        const newComment = new Comment({
            user: userId,
            post: postId,
            text
        })
        await newComment.save()
        post.comments.push(newComment._id)
        await post.save()
        res.status(200).json({
            status: 'success',
            data: {
                newComment
            }
        })
    }
    catch(err){
        console.log(err)
        if(err.name === 'CastError') err = new CustomError('Invalid post id', 400)
        next(err)
    }
}

exports.createCommentReplyController = async (req,res,next) => {
    try{
        const commentId = req.params.commentId
        const parentComment = await Comment.findOne({_id: commentId})
        if(!parentComment) throw new CustomError('Comment does not exist', 400)
        const text = req.body.text
        if(!text) throw new CustomError('Please enter your reply', 400)
        const user = await User.findOne({_id: req._id})
        const reply = {
            user: user._id,
            text
        }
        parentComment.replies.push(reply)
        await parentComment.save()
        res.status(200).json({
            status: 'success',
            data: {
                parentComment
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.updateCommentController = async (req,res,next) => {
    try{
        const commentId = req.params.commentId
        const commentToUpdate = await Comment.findOne({_id: commentId})
        if(!commentToUpdate) throw new CustomError('Comment not found', 400)
        const text = req.body.text
        if(!text) throw new CustomError('Enter comment text to be updated', 400)
        const newComment = await Comment.findByIdAndUpdate(commentId, {
            text
        }, {
            new: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                newComment
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.updateCommentReplyController = async (req,res,next) => {
    try{
        const { commentId, replyId } = req.params
        const text = req.body.text
        const parentComment = await Comment.findOne({_id: commentId})
        if(!parentComment) throw new CustomError('Comment not found', 400)
        const index = parentComment.replies.findIndex(reply => reply._id.toString() === replyId)
        if(index === -1) throw new CustomError('Reply not found', 400)
        if(parentComment.replies[index].user.toString() !== req._id) throw new CustomError('You can only edit your own reply', 400)
        if(!text) throw new CustomError('Please enter the text', 400)
        parentComment.replies[index].text = text
        const comment = await parentComment.save()
        res.status(200).json({
            status: 'success',
            data: {
                comment
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

const populateComments = async comments => {
    for(const comment of comments){
        await comment.populate('user', 'username fullname profilePicture')
        if(comment.replies.length > 0){
            await comment.populate('replies.user', 'username fullname profilePicture')
        }
    }
}

exports.getCommentsByPostController = async (req,res,next) => {
    try{
        const postId = req.params.postId
        const post = await Post.findOne({_id: postId})
        if(!post) throw new CustomError('Post not found', 400)
        const comments = await Comment.find({post: post._id})
        await populateComments(comments)
        res.status(200).json({
            status: 'success',
            data: {
                comments
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteCommentReplyController = async (req,res,next) => {
    try{
        const { commentId, replyId } = req.params
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        comment.replies = comment.replies.filter(reply => reply._id.toString() !== replyId)
        comment = await comment.save()
        res.status(200).json({
            status: 'success',
            data: {
                comment
            }
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.likeCommentController = async (req,res,next) => {
    try{
        const commentId = req.params.commentId
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        // if(comment.likes.some(user => user._id.toString() === req._id)) throw new CustomError('You have already liked this comment', 400)
        if(comment.likes.includes(req._id)) throw new CustomError('You have already liked this comment', 400) // WHY IS THIS WORKING NOW?
        const user = await User.findOne({_id: req._id})
        comment.likes.push(user._id)
        await comment.save()
        res.status(200).json({
            status: 'success',
            message: 'You have liked this comment'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.unlikeCommentController = async (req,res,next) => {
    try{
        const commentId = req.params.commentId
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        if(!comment.likes.includes(req._id)) throw new CustomError('You have not liked this comment', 400)
        const user = await User.findOne({_id: req._id})
        comment.likes = comment.likes.filter(user => user._id.toString() !== req._id)
        await comment.save()
        res.status(200).json({
            status: 'success',
            message: 'You have unliked this comment'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.likeCommentReplyController = async (req,res,next) => {
    try{
        const { commentId, replyId } = req.params
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId)
        if(replyIndex === -1) throw new CustomError('Reply not found', 400)
        if(comment.replies[replyIndex].likes.includes(req._id)) throw new CustomError('You have already liked this reply', 400)
        comment.replies.likes = comment.replies[replyIndex].likes.push(req._id)
        await comment.save()
        res.status(200).json({
            status: 'success',
            message: 'You have liked this reply'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.unlikeCommentReplyController = async (req,res,next) => {
    try{
        const { commentId, replyId } = req.params
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId)
        if(replyIndex === -1) throw new CustomError('Reply not found', 400)
        if(!comment.replies[replyIndex].likes.includes(req._id)) throw new CustomError('You have not liked this reply', 400)
        comment.replies[replyIndex].likes = comment.replies[replyIndex].likes.filter(user => user._id.toString() !== req._id)
        await comment.save()
        res.status(200).json({
            status: 'success',
            message: 'You have unliked this reply'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

exports.deleteCommentController = async (req,res,next) => {
    try{
        const commentId = req.params.commentId
        const comment = await Comment.findOne({_id: commentId})
        if(!comment) throw new CustomError('Comment not found', 400)
        await Post.findOneAndUpdate({comments: commentId}, {$pull: {comments: commentId}})
        await comment.deleteOne()
        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfuly'
        })
    }
    catch(err){
        console.log(err)
        next(err)
    }
}