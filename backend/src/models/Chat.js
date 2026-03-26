const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  isGroup: {
    type: Boolean,
    default: false
  },

  groupName: {
    type: String
  },

  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }

}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
