const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request,response, next)=>{
    try{
        const body = request.body

        if(!body.password || body.password.length < 3){
            return response.status(400).json({'error':'invalid'})
        }

        const saltRounds = 10

        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }
    catch(exception){
        next(exception)
    }
})

userRouter.get('/', async (request,response)=>{
    const users = await User.find({}).populate('blogs',{title:1,url:1,author:1,likes:1})
    response.json(users.map(user=>user.toJSON()))
})

module.exports = userRouter