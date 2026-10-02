import { Link } from "react-router-dom";
import { VideoSessionIcon, CalendarIcon, MessageSquareIcon } from "../common/Icons";

function UpcomingSession({ session, therapist }) {
  const therapistName = session?.therapistName || therapist?.name || "Dr. ThuWai";
  const therapistSpec = session?.therapistSpecialization || therapist?.specialization || "Relationship Counseling & CBT";
  const initials = therapistName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TW";

  if (!session) {
    return (
      <article className="dashboard-card upcoming-session-card">
        <div className="card-heading">
          <h2>Upcoming Session</h2>
        </div>
        <div style={{ padding: "32px 16px", textAlign: "center" }}>
          <p style={{ color: "#607d92", fontSize: "13.5px", margin: "0 0 16px" }}>
            You have no upcoming sessions scheduled currently.
          </p>
          <Link to="/client/sessions">
            <button className="client-action-btn primary" type="button">
              + Book Next Session
            </button>
          </Link>
        </div>
      </article>
    );
  }

  const isVideo = session.type === "Video";

  return (
    <article className="dashboard-card upcoming-session-card">
      <div className="card-heading">
        <h2>Upcoming Session</h2>
        <span className={`session-badge ${isVideo ? "video-session" : "chat-session"}`}>
          {isVideo ? <VideoSessionIcon size={12} /> : <MessageSquareIcon size={12} />}
          <span>Confirmed · {session.type || "Video"}</span>
        </span>
      </div>

      <div className="session-content-wrap">
        <div className="therapist-profile-block">
          <div className="therapist-avatar-circle">
            <span>{initials}</span>
          </div>

          <div className="therapist-details">
            <strong>{therapistName}</strong>
            <span>{therapistSpec}</span>
          </div>
        </div>

        <div className="session-timing-box">
          <div className="timing-item">
            <CalendarIcon size={15} />
            <span>{session.dateFormatted || "Tomorrow, Oct 3, 2026"}</span>
          </div>
          <span className="timing-divider">•</span>
          <span className="timing-time">{session.timeFormatted || "6:00 PM – 6:50 PM"} (50 min)</span>
        </div>

        <div className="session-actions-bar">
          <Link to="/client/sessions" style={{ flex: 1, textDecoration: "none" }}>
            <button className="client-action-btn primary" type="button" style={{ width: "100%" }}>
              {isVideo ? <VideoSessionIcon size={14} /> : <MessageSquareIcon size={14} />}
              <span>{isVideo ? "Join Video Session" : "Open Chat Room"}</span>
            </button>
          </Link>
          <Link to="/client/sessions" style={{ textDecoration: "none" }}>
            <button className="client-action-btn secondary" type="button">
              View All
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default UpcomingSession;