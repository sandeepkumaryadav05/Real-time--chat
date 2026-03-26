import "../pages/chat.css";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import ChatBox from "../components/chat/ChatBox";
import API from "../services/api";
import socket from "../socket";

export default function Chat() {
  const auth = JSON.parse(localStorage.getItem("user"));
  const user = auth?.user;

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    const handleOnlineUsers = (data) => {
      setOnlineUsers(data);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user) return;

    loadChats();
  }, [user?._id]);

  const loadChats = async () => {
    try {
      const res = await API.get("/chat");
      setChats(res.data);
    } catch (err) {
      console.error("Load chats error:", err);
    }
  };

  const handleGroupDeleted = () => {
    setSelectedChat(null);
    loadChats();
  };

  return (
    <div className="chat-container">
      <Sidebar
        chats={chats}
        onlineUsers={onlineUsers}
        user={user}
        selectChat={setSelectedChat}
        loadChats={loadChats}
      />

      <ChatBox
        selectedChat={selectedChat}
        user={user}
        onDeleteGroup={handleGroupDeleted}
      />
    </div>
  );
}
