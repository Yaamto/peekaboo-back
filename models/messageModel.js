const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    chat_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
        max:280
    },
    media: [{
      type: String
    }],
  },
  {
    timestamps: true,
  }
);
MessageSchema.plugin(require('mongoose-autopopulate'));
module.exports = { Message: mongoose.model("message", MessageSchema) };
