const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async ()=>{
    await Blog.deleteMany({})
    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('can make a get request', async ()=>{
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('blog has an id', async ()=>{
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
})

test('can post to api', async ()=>{
    const newBlog = {
        title: 'New blog',
        author: 'joe shmoe',
        url: 'a.com',
        likes: 4
    }
    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
})

test('blog with no likes has 0 as default', async ()=>{
    const newBlog = {
        title: 'has no likes',
        author: 'joe shmoe',
        url: 'a.com'
    }

    const postedBlog = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(postedBlog.body.likes).toBe(0)
})

test('blog with no title or no url will not be saved', async ()=>{
    const newBlog = {
        author: 'joe shmoe'
    }
    const blogsAtStart = await helper.blogsInDb()
    const postedBlog = await api.post('/api/blogs').send(newBlog).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
})

test('can make a delete request to API', async ()=>{
    const blogsAtStart = await helper.blogsInDb()
    const toDelete = blogsAtStart[0]
    await api.delete(`/api/blogs/${toDelete.id}`).expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
})

test('a blog can be updated', async ()=>{
    const blogsAtStart = await helper.blogsInDb()
    const toUpdate = blogsAtStart[0]
    const newBlog = {
        title: 'updated blog',
        author: 'granny smith',
        url: 'reddit.com',
        like: 20
    }
    const updatedBlog = await api.put(`/api/blogs/${toUpdate.id}`).send(newBlog)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    const titlesOnly = blogsAtEnd.map(blog=>blog.title)
    expect(titlesOnly).toContain('updated blog')
    const authorsOnly = blogsAtEnd.map(blog=>blog.author)
    expect(authorsOnly).toContain('granny smith')
})

describe('testing users', ()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})
        const users = await helper.usersInDb()
        users.forEach(async (user)=>{
            let userObject = new User(user)
            userObject.save()
        })
    })

    test('a valid user can be added', async ()=>{
        const validUser = {
            name:'dominic',
            password:'password',
            username:'dman5202'
        }

        const usersAtStart = await helper.usersInDb()

        await api.post('/api/users').send(validUser).expect(201)
        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    })
    test('usernames must be unique', async()=>{
        const validUser = {
            name:'dominic',
            password:'password',
            username:'dman5202'
        }
        const invalidUser = {
            name:'dominic',
            password:'password',
            username:'dman5202'
        }
        const usersAtStart = await helper.usersInDb()

        await api.post('/api/users').send(validUser).expect(201)
        await api.post('/api/users').send(invalidUser).expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    })

    test('passwords must be of a certain length', async ()=>{
        const invalidUser = {
            'username': 'froggy',
            'password': 'no'
        }
        const usersAtStart = await helper.usersInDb()
        await api.post('/api/users').send(invalidUser).expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toBe(usersAtEnd.length)
    })
})

afterAll(()=>{
    mongoose.connection.close()
})