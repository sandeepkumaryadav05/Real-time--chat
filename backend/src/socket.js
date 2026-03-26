const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    /* USER ONLINE */
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", [...onlineUsers.keys()]);
    });

    /* JOIN CHAT ROOM */
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      // console.log("Joined chat:", chatId);
    });

    /* MESSAGE SEND */
    socket.on("send-message", (data) => {
      io.to(data.chatId).emit("receive-message", data);
    });

    /* DELETE MESSAGE FOR EVERYONE */
    socket.on("delete-message-everyone", ({ chatId, messageId }) => {
      io.to(chatId).emit("message-deleted-everyone", messageId);
    });

    /* DISCONNECT */
    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("online-users", [...onlineUsers.keys()]);
      // console.log("User disconnected:", socket.id);
    });
  });
};
