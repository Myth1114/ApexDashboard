import { useState } from "react";
import { useStudents } from "../../../context/useStudents";
import "../../../styles/notofication.css";
import { Bell } from "lucide-react";
export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useStudents();
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-wrapper">
      {/* 🔔 Bell */}
      <div className="bell" onClick={() => setOpen(!open)}>
        <Bell className="BellIcon" />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {/* 📦 Dropdown */}
      {open && (
        <div className="notification-dropdown">
          <h4>Notifications({unreadCount})</h4>

          {notifications.length === 0 ? (
            <p className="empty">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="notification-item">
                {/* LEFT ICON */}
                <div className={`notif-dot ${n.type}`}></div>

                {/* CONTENT */}
                <div className="notif-content">
                  <p>{n.message}</p>
                  <span>{formatTime(n.created_at)}</span>
                </div>

                {/* RIGHT BUTTON */}
                <button className="mark-btn" onClick={() => markAsRead(n.id)}>
                  ✔
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ⏱ Time formatter
const formatTime = (time) => {
  if (!time) return "";

  const diff = Math.floor((new Date() - new Date(time)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return new Date(time).toLocaleDateString();
};
