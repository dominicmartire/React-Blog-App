const totalLikes = (blogs)=>{
    return blogs.length > 0 ? blogs.reduce((val, curr)=>val + curr.likes, 0) : 0
}

const favorite = (blogs)=>{
    return blogs.length > 0 ? blogs.reduce((max, curr)=>max.likes > curr.likes ? max : curr) : []
}


module.exports = {totalLikes, favorite}