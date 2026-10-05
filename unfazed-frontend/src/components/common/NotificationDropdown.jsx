import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BellIcon,
  VideoSessionIcon,
  MessageSquareIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon
} from "./Icons";
import "../../styles/notifications.css";

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getNotificationIcon(type) {
  switch (type) {
    case "appointment":
      return <VideoSessionIcon size={16} />;
    case "message":
      return <MessageSquareIcon size={16} />;
    case "payment":
    case "invoice":
      return <CheckIcon size={16} />;
    case "package":
      return <CalendarIcon size={16} />;
    default:
      return <BellIcon size={16} />;
  }
}

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id, event) => {
    if (event) event.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch("http://localhost:5000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const deletedItem = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (deletedItem && !deletedItem.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
    }
  };

  return (
    <div className="notification-dropdown-wrap" ref={dropdownRef}>
      <button
        className={`notification-bell-btn ${isOpen ? "active" : ""}`}
        type="button"
        aria-label="Notifications"
        title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "Notifications"}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
      >
        <BellIcon size={17} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-popover" role="dialog" aria-label="Notifications popover">
          <div className="notification-popover-header">
            <div className="notification-header-title">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <span className="notification-unread-pill">{unreadCount} new</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                className="notification-mark-all-btn"
                type="button"
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-popover-body">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">
                  <BellIcon size={22} />
                </div>
                <h4 className="notification-empty-title">All caught up!</h4>
                <p className="notification-empty-text">
                  You don't have any notifications right now.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-item ${!notif.isRead ? "unread" : ""}`}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                >
                  <div className={`notification-icon-wrap notification-icon-${notif.type || "system"}`}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-content-header">
                      <h5 className="notification-title">{notif.title}</h5>
                      <span className="notification-time">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="notification-message">{notif.message}</p>
                  </div>

                  {!notif.isRead && <span className="notification-unread-dot" />}

                  <button
                    className="notification-delete-btn"
                    type="button"
                    title="Delete notification"
                    onClick={(e) => handleDelete(notif._id, e)}
                  >
                    <CloseIcon size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-popover-footer">
              Showing recent notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
