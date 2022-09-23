const { Comment } = require("../models/commentModel")

module.exports.addComment = async(req, res) => {
    const post = req.params.post
    const user_id = res.locals.user._id
    const content = req.body.comment

    try {
        if(content){
            const data = await Comment.create({
                post_id: post,
                user_id: user_id,
                content: content,
            })
            return res.status(200).json({data: data})
        }else {
            return res.status(404).json({erreur : "The comment's content is empty"})
        }
    }
    catch(err){
        return res.status(504).json(err)
    }

}
            
                