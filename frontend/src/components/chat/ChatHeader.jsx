const getAvatar = (name) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
};

export default function ChatHeader({ selectedChat, user, onDeleteGroup }) {
  const name =
    selectedChat.groupName ||
    selectedChat.users?.find(u => u._id !== user._id)?.name ||
    "Chat";

  const canDeleteGroup =
    selectedChat.isGroup &&
    selectedChat.groupAdmin &&
    (selectedChat.groupAdmin._id || selectedChat.groupAdmin).toString() ===
      user._id.toString();

  const handleDelete = async () => {
    if (!window.confirm("Delete this group and all messages?")) return;
    if (typeof onDeleteGroup === "function") {
      await onDeleteGroup(selectedChat._id);
    }
  };

  return (
    <div className="chat-header">
      <div className="user-content">
        <img src={getAvatar(name)} className="avatar" alt="avatar" />
        <span>{name}</span>
      </div>

      {canDeleteGroup && (
        <button className="delete-btn" onClick={handleDelete}>
          Delete Group
        </button>
      )}
    </div>
  );
}