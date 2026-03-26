import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../pages/chat.css";

import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList";
import NewChatList from "./NewChatList";
import GroupModal from "../GroupModal";

export default function Sidebar({
  chats,
  onlineUsers,
  user,
  selectChat,
  loadChats
}) {
  const [users, setUsers] = useState([]);
  const [showGroup, setShowGroup] = useState(false);

  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data))
      .catch(console.log);
  }, []);

  const startChat = async (userId) => {
    try {
      const res = await API.post("/chat", { userId });
      selectChat(res.data);
      loadChats && loadChats();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sidebar">

      <SidebarHeader openGroup={() => setShowGroup(true)} />

      <ChatList
        chats={chats}
        user={user}
        onlineUsers={onlineUsers}
        selectChat={selectChat}
      />

      <NewChatList
        users={users}
        onlineUsers={onlineUsers}
        startChat={startChat}
      />

      {showGroup && (
        <GroupModal close={() => setShowGroup(false)} />
      )}
    </div>
  );
}