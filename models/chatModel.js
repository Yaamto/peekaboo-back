const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    // chatName: {
    //      type: String,
    //      trim: true
    //      },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        autopopulate: { select: "-password" },
      },
    ],
        latestMessage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "message",
          autopopulate: true
      },
  },
  {
    timestamps: true,
  }
);
ChatSchema.plugin(require("mongoose-autopopulate"));
module.exports = { Chat: mongoose.model("chat", ChatSchema) };
