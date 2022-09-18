const Post = require("../models/postModel").Post;
const User = require("../models/userModel").User;
const { isEmpty } = require("../config/customFunction");
const ObjectId = require('mongoose').Types.ObjectId;

//POST
module.exports.addPost = async(req, res) => {
    const id = res.locals.user._id
    const { content, media } = req.body
    try {
        if (content) {
            const newPost = await Post.create({
                poster: id,
                content: content,
                media: media ? media : ""
            })
            return res.status(200).json({msg: newPost})
        } else {
            return res.status(500).json({error: "No content provided"})
        }
    } catch(err) {
        console.log(err)
    }
}

//POST
module.exports.deletePost = async(req, res) => {
    const {_id, isAdmin} = res.locals.user
    try {
        const post = await Post.findById(req.body.post_id)
        if(post && post.poster.toString() === _id.toString() || isAdmin === true) {
            await post.delete()
            return res.status(200).json({msg: "Delete successful"})    
        } else {
            return res.status(500).json({error: "Invalid post Id, post already deleted, or this post isn't yours"})
        }
    } catch(err) {
        console.log(err)
    }
}

//POST
module.exports.editPost = async(req, res) => {
    const id = res.locals.user._id
    const { post_id, content, media } = req.body
    try {
        const post = await Post.findById(post_id)
        if (post && post.poster.toString() === id.toString()) {
            post.content = content ? content : post.content
            post.edited = true
            post.save()
            res.status(200).json({msg: "Post updated successfully"})
        } else {
            res.status(500).json({error: "Post has not been updated. Check your content"})
        }
    } catch(err) {
        console.log(err)
    }
}

//POST
module.exports.likePost = async(req, res) => {
    const id = res.locals.user._id
    try {
        const post = await Post.findById(req.body.post_id)
        const currentUser = await User.findById(id)
        console.log(currentUser.likes)
        if(post && currentUser) {
            if(!post.likes.includes(id) && !currentUser.likes.includes(post._id)){
                post.likes.push(id)
                currentUser.likes.push(post._id)
                post.save()
                currentUser.save()
                return res.status(200).json({msg: "Like added", post: post})
                
            } else {
                const indexOfUserLike = post.likes.indexOf(id)
                const indexOfPostLike = currentUser.likes.indexOf(post._id)
                post.likes.splice(indexOfUserLike, 1)
                currentUser.likes.splice(indexOfPostLike, 1)
                post.save()
                currentUser.save()
                return res.status(200).json({msg: "Like removed", post: post})
            }
        } else {
            return res.status(500).json({error: "Post not found or you're not logged in"})
        }

    } catch(err) {
        console.log(err)
    }
}

//GET

module.exports.singlePost = async(req, res) => {
    try {
        const post = ObjectId.isValid(req.params.post_id) ? await Post.findById(req.body.post_id)
        .populate({ path: 'poster', select: '_id username isAdmin' })
        .populate({ path: 'likes', select: '-password' }) 
        // .populate({ path: 'comments', select: '_id username isAdmin' })
        : null
        
        if (post) {
            return res.status(200).json({data: post})
        } else {
            return res.status(500).json({error: "This post does not exist, or has been removed by his poster."})
        }
    } catch(err) {
        console.log(err)
    }
}
