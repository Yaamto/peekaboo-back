const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      max: 280,
      required: true,
    },
    sortDate: {
      type: Date,
      default: Date.now()
    },
    media: {
      type: String
    },
    likes: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        likedAt: {
          type:Date,
          default: Date.now()
        },
        _id : false 
      }
    ],
    reposters: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        repostedAt: {
          type:Date,
          default: Date.now()
        },
        _id : false 
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment" 
      }
    ],
    edited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = { Post: mongoose.model("post", PostSchema) };
