const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: String,
    file: String,

    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isDeletedForEveryone: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
