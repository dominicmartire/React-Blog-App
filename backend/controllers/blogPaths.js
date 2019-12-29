const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = request =>{
    const authorization = request.get('authorization')

    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}

blogRouter.get('/', async (request, response,next) => {
    /*Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
    })*/

    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response,next) => {
    const body = request.body
    const token = tokenExtractor(request)

    if(!body.title || !body.url){
        return response.status(400).json({'error':'title or url missing'})
   }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)

        if(!token || !decodedToken.id){
            return response.status(401).json({error:'token missing or invalid'})
        }

        const blog = new Blog({
            title: body.title,
            url: body.url,
            author:body.author,
            likes:body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog.toJSON())
    }
    catch(exception){
        next(exception)
    }
})

blogRouter.delete('/:id', async (request, response,next)=>{
    const blog = await Blog.findById(request.params.id)
    const userId = blog.user.toString()
    const user = await User.findById(userId)

    try{
        const decodedToken = jwt.verify(tokenExtractor(request), process.env.SECRET)
        if(!tokenExtractor(request) || !decodedToken.id){
            return response.status(401).json({error:'token missing or invalid'})
        }

        await Blog.findByIdAndRemove(request.params.id)
        user.blogs = user.blogs.filter(blog=>blog.id.toString() !== request.params.id)
        await user.save()
        response.status(204).end()
    }
    catch(exception){
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response,next)=>{
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true}).populate('user')
        updatedBlog.user = body.user
        console.log(updatedBlog)
        response.json(updatedBlog.toJSON())
    }
    catch(exception){
        next(exception)
    }
})

module.exports = blogRouter