const getAvatar = (name) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
};

export default function UserItem({
  user,
  onlineUsers,
  onClick
}) {
  return (
    <div className="user" onClick={onClick}>
      <div className="user-content">
        <img
          src={getAvatar(user.name)}
          className="avatar"
          alt="avatar"
        />
        <span>{user.name}</span>
      </div>

      <span
        className={`status-dot ${
          onlineUsers.includes(user._id)
            ? "online"
            : ""
        }`}
      />
    </div>
  );
}