import React from 'react'

const Title = ({setTitle}) =>{
    return(
        <div>
            title:
            <input type="text" onChange={({target}) => setTitle(target.value)}/>
        </div>
    )
}

const Author = ({setAuthor}) =>{
    return(
        <div>
            author:
            <input type="text" onChange={({target}) => setAuthor(target.value)}/>
        </div>
    )
}

const Url = ({setUrl})=>{
    return(
        <div>
            url:
            <input type="text" onChange={({target}) => setUrl(target.value)}/>
        </div>
    )
}
const BlogForm = ({handleSubmit, setTitle, setAuthor, setUrl}) =>{
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <Title setTitle={setTitle}/>
                <Author setAuthor={setAuthor}/>
                <Url setUrl={setUrl}/>
                <button type="submit">Submit blog</button>
            </form>
        </div>
    )
}

export default BlogForm