const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogPaths.js')
const userRouter = require('./controllers/userPaths')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const mongoUrl = config.MONGODB_URI
const logger = require('./utils/logging')

console.log('Connecting to', mongoUrl)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
//app.use(express.static('build'))


app.use(bodyParser.json())
app.use('/api/blogs', blogRouter) //makes it so all requests need to start with /api/blogs
app.use('/api/users', userRouter)
app.use('/api/login',loginRouter)


app.use(middleware.requestLogger)

app.use(middleware.errorHandler)

app.use(middleware.unknownEndpoint)

module.exports = app