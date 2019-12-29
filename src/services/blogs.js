import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken =>{
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}


const post = async (newBlog)=>{
  const config = {
    headers: {Authorization: token}
  }
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const like = async (id, blog)=>{
  const request = await axios.put(`${baseUrl}/${id}`, blog)
  return request.data
}

const remove = async (id) =>{
  const config = {
    headers: {Authorization: token}
  }
  await axios.delete(`${baseUrl}/${id}`,config)

}

export default { getAll, post, like, remove, setToken}