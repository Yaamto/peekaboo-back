const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        max:280,
        required:true
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                autopopulate: {select: "_id username profilePic isAdmin"}
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);
CommentSchema.plugin(require('mongoose-autopopulate'));
module.exports = { Comment: mongoose.model("comment", CommentSchema) };
