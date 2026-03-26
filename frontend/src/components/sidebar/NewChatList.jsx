import UserItem from "./UserItem";

export default function NewChatList({
  users,
  onlineUsers,
  startChat
}) {
  return (
    <div className="new-chat">
      <div className="divider"></div>
      <h4>Start New Chat</h4>
      <div className="divider"></div>

      {users.map(u => (
        <UserItem
          key={u._id}
          user={u}
          onlineUsers={onlineUsers}
          onClick={() => startChat(u._id)}
        />
      ))}
    </div>
  );
}