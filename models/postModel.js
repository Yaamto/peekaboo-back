const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      autopopulate: {select: "_id username isAdmin"}
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
          autopopulate: {select: "_id username profilePic isAdmin"}
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
          autopopulate: {select: "_id username profilePic isAdmin"}
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
        ref: "comment",
        autopopulate: true
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
PostSchema.plugin(require('mongoose-autopopulate'));
module.exports = { Post: mongoose.model("post", PostSchema) };
