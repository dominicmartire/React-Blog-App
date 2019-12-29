import React, {useState} from 'react'

const Blog = ({ blog, like, deleteBlog, showDelete}) => {

  const [showExtras, setShowExtras] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const extras = ()=>{
    return(
      <div>
        <div>
          {blog.author}
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes: {blog.likes} <button onClick ={like}>like</button>
        </div>
      </div>
    )
  }

  return(
  <div style = {blogStyle}>
    <div onClick = {()=>setShowExtras(!showExtras)}>
      {blog.title}
    </div>
    {showExtras ? extras() : null}
    <div>
      {showDelete ? <button onClick={deleteBlog}>Remove blog</button> : null}
    </div>
  </div>
)}

export default Blog