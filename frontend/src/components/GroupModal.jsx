import { useState } from "react";
import API from "../services/api";
import "../pages/chat.css";

export default function GroupModal({ close }) {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  /* SEARCH USERS */
  const searchUsers = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await API.get(`/auth/search?q=${text}`);
      setSuggestions(res.data);
    } catch {
      console.log("Search error");
    }
  };

  /* ADD USER */
  const addUser = (u) => {
    if (selected.some(x => x._id === u._id)) return;

    setSelected(prev => [...prev, u]);
    setQuery("");
    setSuggestions([]);
  };

  /* REMOVE USER */
  const removeUser = (id) => {
    setSelected(prev => prev.filter(u => u._id !== id));
  };

  /* CREATE GROUP */
  const createGroup = async () => {
    if (!name.trim()) return alert("Enter group name");
    if (!selected.length) return alert("Select users");

    try {
      setLoading(true);

      await API.post("/chat/group", {
        name,
        users: selected.map(u => u.name)
      });

      alert("Group created successfully");
      close();

    } catch (err) {
      alert(err.response?.data?.msg || "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div
        className="group-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Group</h2>

        {/* GROUP NAME */}
        <input
          className="modal-input"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* SEARCH USER */}
        <input
          className="modal-input"
          placeholder="Search users..."
          value={query}
          onChange={(e) => searchUsers(e.target.value)}
        />

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map(u => (
              <div
                key={u._id}
                className="suggestion-item"
                onClick={() => addUser(u)}
              >
                {u.name}
              </div>
            ))}
          </div>
        )}

        {/* SELECTED USERS */}
        <div className="selected-users">
          {selected.map(u => (
            <span key={u._id} className="user-chip">
              {u.name}
              <button onClick={() => removeUser(u._id)}>✕</button>
            </span>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="modal-buttons">
          <button onClick={close}>Cancel</button>
          <button
            className="create-btn"
            onClick={createGroup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
