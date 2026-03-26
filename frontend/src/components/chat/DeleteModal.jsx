import "./DeleteModel.css";
export default function DeleteModal({ deleteMsg, user, onClose, onDelete }) {
  const isSender =
    deleteMsg.sender === user._id ||
    deleteMsg.sender?._id === user._id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Message</h3>

        {isSender && (
          <button onClick={() => onDelete("everyone")}>
            Delete for Everyone
          </button>
        )}

        <button onClick={() => onDelete("me")}>
          Delete for Me
        </button>

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}