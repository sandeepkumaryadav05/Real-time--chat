import { useState } from "react";
import socket from "../../socket";
import API from "../../services/api";

export default function ChatInput({ selectedChat, user }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message) return;

    const data = {
      chatId: selectedChat._id,
      sender: user._id,
      text: message,
      createdAt: new Date(),
    };

    socket.emit("send-message", data);

    await API.post("/chat/message", {
      chatId: selectedChat._id,
      text: message,
    });

    setMessage("");
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", selectedChat._id);

    const res = await API.post("/chat/file", formData);
    socket.emit("send-message", res.data);
  };

  return (
    <div className="input-box">

      <label>
        📎
        <input type="file" hidden onChange={handleFile} />
      </label>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button onClick={sendMessage}>Send</button>

    </div>
  );
}