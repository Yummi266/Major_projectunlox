import { Link } from "react-router-dom";
import { InvoiceIcon, VideoSessionIcon, MessageSquareIcon, CalendarIcon } from "../common/Icons";

function formatActivityTime(dateStr) {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ClientActivity({ activities = [] }) {
  const defaultActivities = [
    {
      time: new Date(),
      type: "session",
      title: "Completed 50-minute Video Session with Dr. ThuWai",
      actionLabel: "Session Summary"
    },
    {
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "message",
      title: "Received session reflection & guidance from Dr. ThuWai",
      actionLabel: "View Message"
    },
    {
      time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      type: "booking",
      title: "Confirmed upcoming Video Consultation for Oct 3, 2026",
      actionLabel: "View Details"
    },
    {
      time: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      type: "invoice",
      title: "Standard Package care invoice settled successfully",
      actionLabel: "Receipt PDF"
    }
  ];

  const displayList = Array.isArray(activities) && activities.length > 0 ? activities : defaultActivities;

  const renderIcon = (type) => {
    switch (type) {
      case "session":
        return <VideoSessionIcon size={14} />;
      case "message":
        return <MessageSquareIcon size={14} />;
      case "booking":
        return <CalendarIcon size={14} />;
      case "invoice":
      default:
        return <InvoiceIcon size={14} />;
    }
  };

  const getLink = (type) => {
    switch (type) {
      case "session":
      case "booking":
        return "/client/sessions";
      case "message":
        return "/messages";
      default:
        return "#";
    }
  };

  return (
    <article className="dashboard-card activity-card">
      <div className="card-heading">
        <h2>Recent Activity & Care History</h2>
      </div>

      <div className="activity-list">
        {displayList.map((item, index) => (
          <div className="activity-item" key={index}>
            <div className="activity-time">{formatActivityTime(item.time)}</div>

            <div className="activity-description">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {renderIcon(item.type)}
                {item.title}
              </span>

              <Link to={getLink(item.type)}>
                <button type="button">{item.actionLabel || "View"}</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ClientActivity;
