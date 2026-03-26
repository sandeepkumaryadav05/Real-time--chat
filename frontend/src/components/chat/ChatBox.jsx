import "../../pages/chat.css";
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import API from "../../services/api";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import DeleteModal from "./DeleteModal";

export default function ChatBox({ selectedChat, user, onDeleteGroup }) {
  const [messages, setMessages] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const bottomRef = useRef(null);

  /* JOIN CHAT */
  useEffect(() => {
    if (!selectedChat) return;
    socket.emit("join-chat", selectedChat._id);
  }, [selectedChat]);

  /* LOAD MESSAGES */
  useEffect(() => {
    if (!selectedChat) return;

    API.get(`/chat/${selectedChat._id}`)
      .then((res) => setMessages(res.data))
      .catch(console.log);
  }, [selectedChat]);

  /* RECEIVE MESSAGE */
  useEffect(() => {
    const receive = (data) => {
      if (data.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive-message", receive);
    return () => socket.off("receive-message", receive);
  }, [selectedChat]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* DELETE */
  const handleDelete = async (type) => {
    try {
      if (type === "everyone") {
        await API.put(`/chat/message/delete-everyone/${deleteMsg._id}`);

        setMessages((prev) =>
          prev.map((m) =>
            m._id === deleteMsg._id
              ? {
                  ...m,
                  text: "This message was deleted",
                  file: null,
                  isDeletedForEveryone: true,
                }
              : m
          )
        );
      } else {
        await API.put(`/chat/message/delete/${deleteMsg._id}`);

        setMessages((prev) =>
          prev.filter((m) => m._id !== deleteMsg._id)
        );
      }

      setDeleteMsg(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (!selectedChat) return <h2>Select a chat</h2>;

  const handleDeleteGroup = async (chatId) => {
    try {
      await API.delete(`/chat/${chatId}`);
      if (typeof onDeleteGroup === "function") {
        onDeleteGroup();
      }
    } catch (err) {
      console.error("Delete group error", err);
      alert(err.response?.data?.msg || "Failed to delete group");
    }
  };

  return (
    <div className="chatbox">

      <ChatHeader
        selectedChat={selectedChat}
        user={user}
        onDeleteGroup={handleDeleteGroup}
      />

      <MessageList
        messages={messages}
        user={user}
        setDeleteMsg={setDeleteMsg}
        bottomRef={bottomRef}
      />

      <ChatInput selectedChat={selectedChat} user={user} />

      {deleteMsg && (
        <DeleteModal
          deleteMsg={deleteMsg}
          user={user}
          onClose={() => setDeleteMsg(null)}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}