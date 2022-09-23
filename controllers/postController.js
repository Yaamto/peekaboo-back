const Post = require("../models/postModel").Post;
const User = require("../models/userModel").User;
const feedOrderer = require("../tools/customFunctions").feedOrderer;
const { concat } = require("lodash");
var _ = require('lodash');
const { isEmpty } = require("../config/customFunction");
const ObjectId = require('mongoose').Types.ObjectId;

//POST
module.exports.addPost = async(req, res) => {
    const id = res.locals.user._id
    const { content, media } = req.body
    try {
        if (content) {
            const theDate = new Date()
            const newPost = await Post.create({
                poster: id,
                content: content,
                media: media ? media : "",
                sortDate: theDate
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
        const date = new Date()
        if(post && currentUser) {
            console.log(id)
            if(!post.likes.some(likeObject => likeObject.id.toString() == id) && !currentUser.likes.includes(post._id)){
                const newUser = await User.findByIdAndUpdate(id, {$push: {likes: post._id}})
                const newPost = await Post.findByIdAndUpdate(req.body.post_id, {$push: {likes: {id: id, likedAt: date}}}).then(() => res.status(200).json({msg: "Like added", post: post}))
                
            } else {
                const newUser = await User.findByIdAndUpdate(id, {$pull: {likes: {$eq: post._id}}});
                const newPost = await Post.findByIdAndUpdate(req.body.post_id, {$pull: {likes: { id: {$eq: id} }}}).then(() => res.status(200).json({msg: "Like removed", post: post}))
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
        const post = ObjectId.isValid(req.params.post_id) ? await Post.findById(req.params.post_id)
        .populate({ path: 'poster', select: '_id username isAdmin' })
        .populate({ path: 'likes', select: '-password' }) 
        .populate({ path: 'comments', populate : {path : "user", select : "-password"} })
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

module.exports.feed = async(req, res) => {

    const selfUser = await User.findById(res.locals.user._id).select('following -_id');
    const page = (req.params.page - 1);

    try {

        const likesArray = await Post.find({ "likes.id":  {$in: selfUser.following} })
        likesArray.map(post => {
            let indexLike;
            post.likes.map((object, key) =>  selfUser.following.includes(object.id) ? indexLike = key : null)
            post.sortDate = post.likes[indexLike].likedAt
        })

        const repostersArray = await Post.find({ "reposters.id":  {$in: selfUser.following} })
        repostersArray.map(post => {
            let indexRepost;
            post.reposters.map((object, key) =>  selfUser.following.includes(object.id) ? indexRepost = key : null)
            post.sortDate = post.reposters[indexRepost].repostedAt  
        })

        const posterArray = await Post.find({poster: { $in: selfUser.following }})

        let concatArray = _.concat(posterArray, likesArray, repostersArray)

        let finalArray =  _.chunk(feedOrderer(concatArray), 3)
        
        res.json(finalArray[page])
    } catch(err) {
        console.log(err)
    }

}
