import API from "../../services/api";

export default function MessageItem({ msg, user, onDelete }) {
  const senderId =
    typeof msg.sender === "string"
      ? msg.sender
      : msg.sender?._id;

  const isMe = senderId === user._id;

  const getFileUrl = (file) => {
    const base = API.defaults.baseURL.replace(/\/api\/?$/, "");
    return `${base}${file}`;
  };

  return (
    <div className={`msg ${isMe ? "me" : "other"}`}>
      <div className="bubble">

        {msg.isDeletedForEveryone ? (
          <span>This message was deleted</span>
        ) : (
          <>
            {msg.text && <span>{msg.text}</span>}

            {msg.file && (
              <img
                src={getFileUrl(msg.file)}
                alt="file"
                className="msg-image"
                onClick={() => window.open(getFileUrl(msg.file))}
              />
            )}
          </>
        )}

        <div className="msg-footer">
          <small>
            {new Date(msg.createdAt).toLocaleTimeString()}
          </small>

          <button onClick={onDelete}>🗑</button>
        </div>

      </div>
    </div>
  );
}