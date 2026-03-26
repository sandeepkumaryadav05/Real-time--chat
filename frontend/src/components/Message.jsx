import "./message.css";

export default function Message({ msg, user, onDelete }) {
  const senderId =
    typeof msg.sender === "string" ? msg.sender : msg.sender?._id;

  const isMe = senderId === user._id;

  return (
    <div className={`message-row ${isMe ? "me" : "other"}`}>
      <div className="message-bubble">

        {/* DELETED MESSAGE */}
        {msg.isDeletedForEveryone ? (
          <span className="deleted-msg">
            This message was deleted
          </span>
        ) : (
          <>
            {/* TEXT */}
            {msg.text && (
              <span className="msg-text">{msg.text}</span>
            )}

            {/* IMAGE */}
            {msg.file && (
              <img
                src={
                  msg.file.startsWith("http")
                    ? msg.file
                    : `http://localhost:3000${msg.file}`
                }
                className="msg-image"
                alt="img"
                onClick={() =>
                  window.open(
                    msg.file.startsWith("http")
                      ? msg.file
                      : `http://localhost:3000${msg.file}`
                  )
                }
              />
            )}
          </>
        )}

        {/* FOOTER */}
        <div className="msg-footer">

          {/* TIME */}
          <small>
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </small>

          {/* DELETE BUTTON */}
          {isMe && !msg.isDeletedForEveryone && (
            <button
              className="delete-btn"
              onClick={() => onDelete(msg)}
            >
              🗑
            </button>
          )}
        </div>

      </div>
    </div>
  );
}