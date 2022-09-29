const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    chat_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        max:280
    },
    media: [{
      type: String
    }],
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);
MessageSchema.plugin(require('mongoose-autopopulate'));
module.exports = { Message: mongoose.model("message", MessageSchema) };
