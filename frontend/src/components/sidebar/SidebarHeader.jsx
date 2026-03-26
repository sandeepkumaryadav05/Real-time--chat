export default function SidebarHeader({ openGroup }) {
  return (
    <div className="sidebar-header">
      Chats
      <button className="group-btn" onClick={openGroup}>
        + Group
      </button>
    </div>
  );
}