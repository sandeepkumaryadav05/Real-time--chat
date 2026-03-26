const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  accessChat,
  createGroup,
  fetchMessages,
  sendMessage,
  deleteMessage,
  deleteChat,
  fetchChats,
  deleteForMe,
  deleteForEveryone,
  sendFileMessage
} = require("../controllers/chat.controller");

const upload = require("../middleware/upload.js");

router.post("/", auth, accessChat);        // open private chat
router.get("/", auth, fetchChats);         // load chats
router.post("/group", auth, createGroup);  // create group
router.get("/:chatId", auth, fetchMessages); // load messages
router.post("/message", auth, sendMessage);  // send message
router.delete("/message/:messageId", auth, deleteMessage);
router.delete("/:chatId", auth, deleteChat);
router.put("/message/delete/:messageId", auth, deleteForMe);
router.put("/message/delete-everyone/:messageId", auth, deleteForEveryone);
router.post("/file",auth,upload.single("file"),sendFileMessage);

module.exports = router;
