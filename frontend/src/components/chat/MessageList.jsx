import MessageItem from "./MessageItem";

export default function MessageList({ messages, user, setDeleteMsg, bottomRef }) {
  return (
    <div className="messages">
      {messages.map((msg, i) => (
        <MessageItem
          key={i}
          msg={msg}
          user={user}
          onDelete={() => setDeleteMsg(msg)}
        />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}