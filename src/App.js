import React, {useState, useEffect} from 'react';
import loginService from './services/login';
import blogService from './services/blogs'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notifaction from './components/Notification'
import Toggleable from './components/Toggleable'

const App = ()=> {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [blogTitle, setTitle] = useState('')
  const [blogAuthor, setAuthor] = useState('')
  const [blogUrl, setUrl] = useState('')
  const [websiteMessage, setWebsiteMessage] = useState('')

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(()=>{
    const getBlogs = async () =>{
      const blogList = await blogService.getAll()
      setBlogs(blogList.sort((blog1, blog2)=>blog2.likes - blog1.likes))
    }
    getBlogs()
    console.log('updating blogs')
  },[])

  const handleLogin = async (event)=>{
    event.preventDefault()
    try{
      const user = await loginService.login({username,password})
      setUser(user)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setWebsiteMessage(`${user.name} logged in`)
      blogService.setToken(user.token)
      setTimeout(()=>setWebsiteMessage(null), 5000)
    }
    catch(exception){
      console.log(exception)
    }
  }

  const logout = (event)=>{
    event.preventDefault()
    setWebsiteMessage(`${user.name} logged out`)
    setTimeout(()=>setWebsiteMessage(null), 5000)
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')

  }

  const renderBlogs = () =>{
    const blogComponents =  blogs.map(blog=>{
      let showDelete = false
      if(window.localStorage.getItem('loggedBlogUser')){
        showDelete = blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogUser')).username
      }
      return(
        <Blog key={blog.id}
              blog={blog}
              like = {()=>handleLike(blog.id)}
              deleteBlog = {()=>handleDelete(blog.id)}
              showDelete = {showDelete}
        />)
    })
    return(
      <div>
        <div>
          <h1>Blogs</h1>
            <div>{`${user.name} logged in`} <button onClick={logout}>logout</button></div>
            <div>
              {blogComponents}
            </div>
        </div>
      </div>)
  }

  const loginForm = () =>{
    return(
      <div>
      <h1>Log in to application</h1>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input type='text' value={username} onChange={({target})=>setUsername(target.value)}/>
        </div>
        <div>
          password
          <input type='text' value={password} onChange={({target})=>setPassword (target.value)}/>
        </div>
      <button type="submit">login</button>
      </form>
      </div>
    )
  }

  const blogForm = ()=>{
    return(
      <div>
        <Toggleable buttonLabel = "new blog">
          <h2>Create Blog</h2>
          <BlogForm setAuthor={setAuthor} setTitle={setTitle} setUrl={setUrl} handleSubmit={handleSubmit}/>
        </Toggleable>
      </div>
  )}

  const handleSubmit = async (event)=>{
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      url: blogUrl,
      author: blogAuthor
    }
    try{
      const response = await blogService.post(blogObject)
      setBlogs(blogs.concat(response))
    }
    catch(exception){
      setWebsiteMessage(`Error submitting blog`)
      setTimeout(()=>setWebsiteMessage(null), 5000)
      console.log(exception)
    }
  }

  const handleLike = async id=>{
    const blog = blogs.find(blog=>blog.id === id)
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      likes: blog.likes + 1
    }

    const returnedBlog = await blogService.like(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
  }


  const handleDelete = async (id)=>{
    const toDelete = window.confirm('Are you sure you want to delete this blog?')
    if(toDelete){
      await blogService.remove(id)
      setBlogs(blogs.filter(blog=>blog.id !== id))
    }
  }

  return (
    <div className="App">
    <Notifaction message={websiteMessage}/>
    {user === null ? loginForm() : renderBlogs()}
    {user === null ? <div></div> : blogForm()}
    </div>
  )
}

export default App
