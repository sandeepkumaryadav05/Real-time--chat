import ChatItem from "./ChatItem";

export default function ChatList({
  chats,
  user,
  onlineUsers,
  selectChat
}) {
  return (
    <div className="user-list">
      {chats.map(chat => (
        <ChatItem
          key={chat._id}
          chat={chat}
          user={user}
          onlineUsers={onlineUsers}
          onClick={() => selectChat(chat)}
        />
      ))}
    </div>
  );
}