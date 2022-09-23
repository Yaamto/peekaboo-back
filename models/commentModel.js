const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    user_id : {
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
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = { Comment: mongoose.model("comment", CommentSchema) };
