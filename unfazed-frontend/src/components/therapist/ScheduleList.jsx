import { useState, useEffect } from "react";
import axios from "axios";
import {
  VideoSessionIcon,
  MessageSquareIcon,
  UsersIcon,
  CheckIcon
} from "../common/Icons";

function ScheduleList({ refreshKey }) {
  const [filter, setFilter] = useState("all");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/appointments");
        if (res.data?.appointments && Array.isArray(res.data.appointments)) {
          const mapped = res.data.appointments.map((appt) => {
            const initials = appt.clientName
              ? appt.clientName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "CL";

            return {
              id: appt._id,
              startTime: appt.startTime || "10:00 AM",
              endTime: appt.endTime || "10:50 AM",
              client: appt.clientName || "Client",
              initials,
              type: appt.type || "Video",
              topic: appt.topic || "Clinical Consultation",
              isCompleted: Boolean(appt.isCompleted),
              status: appt.status || (appt.isCompleted ? "Completed" : "Upcoming"),
              mediumClass: (appt.type || "video").toLowerCase()
            };
          });

          setSessions(mapped);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [refreshKey]);

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      setUpdatingId(id);
      const newStatus = !currentStatus;
      await axios.put(`http://localhost:5000/api/appointments/${id}`, {
        isCompleted: newStatus,
        status: newStatus ? "Completed" : "Upcoming"
      });

      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                isCompleted: newStatus,
                status: newStatus ? "Completed" : "Upcoming"
              }
            : s
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update session status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSession = async (id, clientName) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel and remove the session with ${clientName}?`
    );
    if (!confirmed) return;

    try {
      setUpdatingId(id);
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete session");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === "all") return true;
    return s.type.toLowerCase() === filter.toLowerCase();
  });

  const videoCount = sessions.filter((s) => s.type === "Video").length;
  const chatCount = sessions.filter((s) => s.type === "Chat").length;
  const inPersonCount = sessions.filter((s) => s.type === "In-Person").length;

  const upcomingSessions = filteredSessions.filter((s) => !s.isCompleted);
  const completedSessions = filteredSessions.filter((s) => s.isCompleted);

  const renderSessionRow = (session) => (
    <div
      key={session.id}
      className={`schedule-row ${
        session.isCompleted ? "completed-row" : "active-row"
      }`}
    >
      {}
      <div className="schedule-row-time">
        <strong>{session.startTime}</strong>
        <span className="time-end">{session.endTime}</span>
      </div>

      {}
      <div className="schedule-row-client">
        <div className="client-avatar-badge-wrap">
          <div className={`client-initials-avatar ${session.mediumClass}`}>
            {session.initials}
          </div>

          <div className="client-meta">
            <div className="client-headline">
              <strong className="client-name">{session.client}</strong>

              <span className={`session-pill-badge ${session.mediumClass}`}>
                {session.type === "Video" && <VideoSessionIcon size={13} />}
                {session.type === "Chat" && <MessageSquareIcon size={13} />}
                {session.type === "In-Person" && <UsersIcon size={13} />}
                <span>{session.type}</span>
              </span>

              {session.isCompleted ? (
                <span className="status-badge completed">
                  <CheckIcon size={12} />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="status-badge scheduled">
                  <span>{session.status}</span>
                </span>
              )}
            </div>

            <span className="session-subtext">{session.topic}</span>
          </div>
        </div>
      </div>

      {}
      <div className="schedule-row-actions">
        {session.isCompleted ? (
          <button
            className="schedule-action-btn secondary"
            type="button"
            onClick={() => handleToggleComplete(session.id, true)}
            disabled={updatingId === session.id}
          >
            Mark Upcoming
          </button>
        ) : (
          <button
            className="schedule-action-btn primary"
            type="button"
            onClick={() => handleToggleComplete(session.id, false)}
            disabled={updatingId === session.id}
          >
            {session.type === "Video" ? (
              <>
                <VideoSessionIcon size={13} />
                <span>Join Call</span>
              </>
            ) : (
              <>
                <MessageSquareIcon size={13} />
                <span>Open Room</span>
              </>
            )}
          </button>
        )}

        <button
          className="schedule-delete-btn"
          type="button"
          onClick={() => handleDeleteSession(session.id, session.client)}
          disabled={updatingId === session.id}
          title="Cancel session"
        >
          ✕
        </button>
      </div>
    </div>
  );

  return (
    <section className="schedule-card schedule-main-card">
      {}
      <div className="schedule-date-header">
        <div className="schedule-title-area">
          <h2>Clinical Schedule</h2>
          <span className="schedule-session-count">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"} booked
          </span>
        </div>

        {}
        <div className="schedule-filter-tabs">
          <button
            type="button"
            className={`filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({sessions.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === "video" ? "active" : ""}`}
            onClick={() => setFilter("video")}
          >
            Video ({videoCount})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === "chat" ? "active" : ""}`}
            onClick={() => setFilter("chat")}
          >
            Chat ({chatCount})
          </button>
          {inPersonCount > 0 && (
            <button
              type="button"
              className={`filter-pill ${filter === "in-person" ? "active" : ""}`}
              onClick={() => setFilter("in-person")}
            >
              In-Person ({inPersonCount})
            </button>
          )}
        </div>
      </div>

      {}
      <div className="schedule-sessions-container">
        {loading ? (
          <div className="schedule-empty-state">
            <p>Loading clinical schedule from database...</p>
          </div>
        ) : (
          <>
            {}
            {upcomingSessions.length > 0 && (
              <div className="schedule-group">
                <div className="schedule-group-header">
                  <span>Upcoming Sessions ({upcomingSessions.length})</span>
                </div>
                <div className="schedule-list">
                  {upcomingSessions.map(renderSessionRow)}
                </div>
              </div>
            )}

            {}
            {completedSessions.length > 0 && (
              <div className="schedule-group completed-group">
                <div className="schedule-group-header">
                  <span>Completed Sessions ({completedSessions.length})</span>
                </div>
                <div className="schedule-list">
                  {completedSessions.map(renderSessionRow)}
                </div>
              </div>
            )}

            {filteredSessions.length === 0 && (
              <div className="schedule-empty-state">
                <p>
                  No {filter !== "all" ? filter : ""} sessions found in schedule. Click "+ Add Session" to book one.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ScheduleList;