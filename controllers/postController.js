const Post = require("../models/postModel").Post;
const { isEmpty } = require("../config/customFunction");


module.exports.addPost = async(req, res) => {
    const id = res.locals.user._id
    const { content, image_content } = req.body
    try {
        if (content) {
            const newPost = await Post.create({
                poster_id: id,
                content: content,
                image_content: image_content
            })
            return res.status(200).json({msg: newPost})
        } else {
            return res.status(500).json({error: "No content provided"})
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports.deletePost = async(req, res) => {
    const id = res.locals.user._id
    try {
        const post = await Post.findById(req.body.post_id)
        if(post && post.poster_id.toString() === id.toString()) {
            await post.delete()
            return res.status(200).json({msg: "Delete successful"})    
        } else {
            return res.status(500).json({error: "Invalid post Id, post already deleted, or this post isn't yours"})
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports.likePost = async(req, res) => {
    const id = res.locals.user._id
    try {
        const post = await Post.findById(req.body.post_id)
        if(post && !post.likes.includes(id)){
            post.likes.push(id)
            post.save()
            return res.status(200).json({msg: "Like added", post: post})
            
        } else if (post.likes.includes(id)) {
            const indexOf = post.likes.indexOf(id)
            post.likes.splice(indexOf, 1)
            post.save()
            return res.status(200).json({msg: "Like removed", post: post})
        } else {
            return res.status(500).json({error: "post not found"})
        }
    } catch(err) {
        console.log(err)
    }
}