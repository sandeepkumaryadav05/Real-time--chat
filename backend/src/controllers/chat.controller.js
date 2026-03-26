const fs = require("fs");
const path = require("path");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

/*ACCESS / CREATE PRIVATE CHAT*/

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = typeof userId === "string" ? userId : (userId && (userId._id || userId.id)) || userId;

    let chat = await Chat.findOne({
      isGroup: false,
      users: { $all: [req.user.id, targetUserId] }
    }).populate("users", "name email");

    if (!chat) {
      chat = await Chat.create({
        users: [req.user.id, targetUserId],
        isGroup: false
      });

      chat = await Chat.findById(chat._id).populate("users", "name email");
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


/* FETCH ALL CHATS (PRIVATE + GROUP)*/

exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user.id] }
    })
      .populate("users", "name email")
      .populate("groupAdmin", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


/*CREATE GROUP CHAT*/

exports.createGroup = async (req, res) => {
  try {
    const { name, users } = req.body;

    const userDocs = await User.find({
      name: { $in: users }
    });

    const ids = userDocs.map(u => u._id);

    const chat = await Chat.create({
      users: [...ids, req.user.id],
      isGroup: true,
      groupName: name,
      groupAdmin: req.user.id
    });

    res.json(chat);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};




/*FETCH MESSAGES (PRIVATE + GROUP)*/

exports.fetchMessages = async (req, res) => {
  const messages = await Message.find({
    chatId: req.params.chatId,
    deletedFor: { $ne: req.user.id }
  }).populate("sender", "name");

  res.json(messages);
};




/*SEND MESSAGE (PRIVATE + GROUP)*/

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ msg: "chatId and text required" });
    }

    let message = await Message.create({
      sender: req.user.id,
      chatId,
      text
    });

    message = await message.populate("sender", "name email");

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndDelete(messageId);

    res.json({ msg: "Message deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ msg: "Chat not found" });

    // Only group admin can delete a group chat.
    if (chat.isGroup) {
      const adminId = chat.groupAdmin?._id
        ? chat.groupAdmin._id.toString()
        : chat.groupAdmin?.toString();
      if (adminId !== req.user.id) {
        return res.status(403).json({ msg: "Only group admin can delete group" });
      }
    }

    await Message.deleteMany({ chatId: chat._id });
    await Chat.findByIdAndDelete(chat._id);

    res.json({ msg: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteForMe = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { deletedFor: req.user.id }
    });

    res.json({ msg: "Deleted for you" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteForEveryone = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message)
      return res.status(404).json({ msg: "Message not found" });

    // Compare ObjectIds properly
    const senderId = message.sender._id ? message.sender._id.toString() : message.sender.toString();
    const userId = req.user.id.toString();

    if (senderId !== userId)
      return res.status(403).json({ msg: "Not allowed" });

    if (message.file) {
      const filePath = path.join(
        process.cwd(),
        message.file.startsWith("/") ? message.file.slice(1) : message.file
      );

      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") console.error("File delete error:", err);
      });

      message.file = undefined;
    }

   
    message.isDeletedForEveryone = true;
    message.text = "This message was deleted";
    await message.save();

    res.json({ msg: "Deleted for everyone" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.sendFileMessage = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId || !req.file) {
      return res.status(400).json({ msg: "chatId and file required" });
    }

    let message = await Message.create({
    sender: req.user.id,
    chatId,
     file: `/uploads/${req.file.filename}` 
   });
    message = await message.populate("sender", "name email");

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    res.status(201).json(message);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
