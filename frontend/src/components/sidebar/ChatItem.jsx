const getAvatar = (name) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
};

export default function ChatItem({
  chat,
  user,
  onlineUsers,
  onClick
}) {
  const isGroup = chat.isGroup;

  const otherUser = chat.users?.find(
    u => u._id !== user._id
  );

  const name = isGroup
    ? chat.groupName
    : otherUser?.name || "Unknown";

  return (
    <div className="user" onClick={onClick}>
      <div className="user-content">
        <img
          src={getAvatar(name)}
          className="avatar"
          alt="avatar"
        />
        <span>{name}</span>
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
}