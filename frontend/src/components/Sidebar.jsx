import { useEffect, useState } from "react";
import API from "../services/api";
import "../pages/chat.css";
import GroupModal from "./GroupModal";

export default function Sidebar({
  chats,
  onlineUsers,
  user,
  selectChat,
  loadChats
}) {
  const [users, setUsers] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const apiCall=(name)=>{
    return `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  }

  /* LOAD USERS */
  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  /* START PRIVATE CHAT */
  const startChat = async (userId) => {
    try {
      const res = await API.post("/chat", { userId });
      selectChat(res.data);
      loadChats && loadChats();
    } catch (err) {
      console.log(err);
    }
  };

  /* DEFAULT AVATAR FUNCTION */
  const getAvatar = (name, avatar, isGroup) => {
  if (isGroup) return "/group-avatar.png";

  if (avatar) return avatar;

  return apiCall(name);
};

  const getGroupAvatar = (name) => {
    return apiCall(name);
  };

  const getStartAvatar = (name) => {
    return apiCall(name);
  };

  return (
    <div className="sidebar">

      {/* HEADER */}
      <div className="sidebar-header">
        Chats
        <button
          className="group-btn"
          onClick={() => setShowGroup(true)}
        >
          + Group
        </button>
      </div>

      {/* EXISTING CHATS */}
      <div className="user-list">
        {chats.map(chat => {
          const isGroup = chat.isGroup;

          const otherUser = chat.users?.find(
            u => u._id !== user._id
          );

          const chatName = isGroup
            ? chat.groupName
            : otherUser?.name || "Unknown";

          const avatar = getAvatar(
            chatName,
            otherUser?.avatar,
            isGroup
          );

          return (
            <div
              key={chat._id}
              className="user"
              onClick={() => selectChat(chat)}
            >
              <div className="user-content">
                <img
                  src={avatar}
                  className="avatar"
                  alt="avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = isGroup
                      ? getGroupAvatar(chatName)
                      : getAvatar(chatName, null, false);
                  }}
                />
                <span>{chatName}</span>
              </div>

              {!isGroup && (
                <span
                  className={`status-dot ${
                    onlineUsers.includes(otherUser?._id)
                      ? "online"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* START NEW CHAT */}
      <div className="new-chat">
        <div className="divider"></div>
        <h4>Start New Chat</h4>
        <div className="divider"></div>

        {users.map(u => (
          <div
            key={u._id}
            className="user"
            onClick={() => startChat(u._id)}
          >
            <div className="user-content">
              <img 
              src={getStartAvatar(u.name)}
              className="avatar" 
              alt="avatar" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = getGroupAvatar(u.name);
              }}
              />
               <span>{u.name}</span> 
            </div>
            <span
              className={`status-dot ${
                onlineUsers.includes(u._id)
                  ? "online"
                  : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* GROUP MODAL */}
      {showGroup && (
        <GroupModal close={() => setShowGroup(false)} />
      )}
    </div>
  );
}
