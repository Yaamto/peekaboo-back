const Post = require("../models/postModel").Post;
const fs = require("fs");
const User = require("../models/userModel").User;
const Comment = require("../models/commentModel").Comment;
const {feedOrderer, mediaHandler} = require("../tools/customFunctions");
const { concat } = require("lodash");
var _ = require('lodash');
const { isEmpty } = require("../config/customFunction");
const ObjectId = require('mongoose').Types.ObjectId;

//POST
module.exports.addPost = async(req, res) => {
    const id = res.locals.user._id
    const {content} = req.body
    const allowedExtension = ['png','jpg','jpeg'];
    let allowedContent = true;

    try {
        if(req.files) {
            (req.files.media.length >= 1 ? req.files.media: [req.files.media]).map(media => {
                let extName = media.name.split('.').pop()
                
                if(!allowedExtension.includes(extName)){
                    allowedContent = false
                }
            })
        }

        if(allowedContent == false) {
            return res.status(422).send("Invalid file format");
        }

        if (content) {
            const theDate = new Date()
            const newPost = await Post.create({
                poster: id,
                content: content,
                sortDate: theDate
            })
            if(req.files != null) {
                await Post.updateOne({_id: newPost._id}, {media : mediaHandler(req.files.media, newPost._id, id, 'post') })
            }
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
    const post = await Post.findById(req.params.id)
    try {
        if(post) {
            if(post.poster._id.valueOf() === _id.valueOf() || isAdmin === true) {
                fs.rmSync(`./media/${_id}/${post._id}/`, { recursive: true, force: true });
                await User.updateMany({likes: {$in : post._id}}, {$pull: {likes: {$eq: post._id} }})
                await User.updateMany({repost: {$in : post._id}}, {$pull: {repost: {$eq: post._id} }})
                await Comment.deleteMany({post_id: post._id})
                await Post.findByIdAndRemove(post._id)
                return res.status(200).json({msg: "Delete successful"})    
            } else {
                return res.status(500).json({error: "This post isn't yours"})
            }
        } else {
            return res.status(500).json({error: "Invalid post Id, post already deleted"})
        }
    } catch(err) {
        console.log(err)
    }
}
//POST
module.exports.editPost = async(req, res) => {
    const id = res.locals.user._id
    const { content, media } = req.body
    try {
        const post = await Post.findById(req.params.id)
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
        const post = await Post.findById(req.params.id)
        const currentUser = await User.findById(id)
        const date = new Date()
        if(post && currentUser) {
            if(!post.likes.some(likeObject => likeObject.id == id) && !currentUser.likes.includes(post._id)){
                const newUser = await User.findByIdAndUpdate(id, {$push: {likes: post._id}})
                const newPost = await Post.findByIdAndUpdate(req.params.id, {$push: {likes: {user: id, likedAt: date}}}).then(() => res.status(200).json({msg: "Like added", post: post}))
            } else {
                const newUser = await User.findByIdAndUpdate(id, {$pull: {likes: {$eq: post._id}}});
                const newPost = await Post.findByIdAndUpdate(req.params.id, {$pull: {likes: { user: {$eq: id} }}}).then(() => res.status(200).json({msg: "Like removed", post: post}))
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
        const post = ObjectId.isValid(req.params.post_id) ? await Post.findById(req.params.post_id): null
        
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

        const likesArray = await Post.find({ "likes.user":  {$in: selfUser.following} })
        likesArray.map(post => {
            let indexLike;
            post.likes.map((object, key) =>  selfUser.following.includes(object.user._id) ? indexLike = key : null)
            post.sortDate = post.likes[indexLike].likedAt

        })

        const repostersArray = await Post.find({ "reposters.user":  {$in: selfUser.following} })
        repostersArray.map(post => {
            let indexRepost;
            post.reposters.map((object, key) =>  selfUser.following.includes(object.user._id) ? indexRepost = key : null)
            post.sortDate = post.reposters[indexRepost].repostedAt  
        })

        const posterArray = await Post.find({poster: { $in: selfUser.following }})

        let concatArray = _.concat(posterArray, likesArray, repostersArray)

        let finalArray =  _.chunk(feedOrderer(concatArray), 30)
        
        res.json(finalArray[page])
    } catch(err) {
        console.log(err)
    }

}
