require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const CustomError = require('./utils/CustomError')
const globalErrorHandler = require('./middlewares/globalErrorHandler')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')
const commentRouter = require('./routes/commentRouter')
const storyRouter = require('./routes/storyRouter')
const conversationRouter = require('./routes/conversationRouter')
const messageRouter = require('./routes/messageRouter')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended: true}))

app.use('/social/auth', authRouter)
app.use('/social/user', userRouter)
app.use('/social/post', postRouter)
app.use('/social/comment', commentRouter)
app.use('/social/story', storyRouter)
app.use('/social/conversation', conversationRouter)
app.use('/social/message', messageRouter)

app.use('*', (req,res,next) => {
    throw new CustomError('This route does not exist', 400)
})

app.use(globalErrorHandler)

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
.then(_ => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}...`)
    })
})
.catch(err => {
    console.log(err)
})