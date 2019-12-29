const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }]

const initialUsers = [{
    name: 'joseph',
    username:'j03y',
    password: 'password'
}]

const blogsInDb = async ()=>{
    const blogs = await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

const usersInDb = async ()=>{
    const users = await User.find({})
    return users.map(user=>user.toJSON())
}

module.exports = {initialBlogs, blogsInDb, initialUsers, usersInDb}