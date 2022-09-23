const { Comment } = require("../models/commentModel")
const { Post } = require("../models/postModel")

module.exports.addComment = async(req, res) => {
    const post = req.params.post
    const user_id = res.locals.user._id
    const content = req.body.content

    try {
        if(content){
            const data = await Comment.create({
                post_id: post,
                user_id: user_id,
                content: content,
            })
            try {
                 await Post.findByIdAndUpdate(
                  { _id: post },
                  {
                    $push: {
                      comments: data,
                    },
                  },
                  { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                if (data) {
                    return res.status(200).json({data: data})
                } else {
                  res.json(err);
                }
                
            } catch (erreur) {
              console.log(erreur);
            }
            
        }else {
            return res.status(404).json({erreur : "The comment's content is empty"})
        }
    }
    catch(err){
        return res.status(504).json(err)
    }

}

module.exports.deleteComment = async(req, res) => {
    const comment= req.params.comment
    try {
        const searchComment = await Comment.findById(comment);
        if(res.locals.user._id.toString() === searchComment.user_id.toString()) {
          const data = await Comment.findByIdAndDelete({ _id: comment });

          if (data) {
            try {
                console.log(data.post_id)
               const deleteCommentToPost = await Post.findByIdAndUpdate(
                    {_id: data.post_id},
                    {$pull: {comments: {$eq: comment}}}
                    )
                    if(deleteCommentToPost){
                        res.status(200).send({ deleted: data });
                    }else {
                        res.status(400)
                    }
                }
                catch(err){
                    res.json({erreur: "ouais"})
                }
          } else {
            res.status(404);
          }
        } else {
          res.status(403).json({ erreur: "you are not authorized to perform this action" });
        }
      } catch (err) {
        res.status(404).send({ err: err });
      }
    };

            
                