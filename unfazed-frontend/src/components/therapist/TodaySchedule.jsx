import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { VideoSessionIcon, MessageSquareIcon, UsersIcon } from "../common/Icons";

function TodaySchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/appointments/today");
        if (res.data?.appointments && Array.isArray(res.data.appointments)) {
          const mapped = res.data.appointments.map((appt) => ({
            id: appt._id,
            time: `${appt.startTime} – ${appt.endTime}`,
            client: appt.clientName || "Client",
            type: appt.type || "Video",
            isCompleted: Boolean(appt.isCompleted),
            status: appt.isCompleted
              ? "Completed"
              : appt.type === "Video"
              ? "Join Call"
              : appt.type === "Chat"
              ? "Open Room"
              : "Open Session"
          }));
          setAppointments(mapped);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Failed to fetch today's appointments:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchToday();
  }, []);

  return (
    <article className="dashboard-card schedule-card">
      <div
        className="card-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>Today's Schedule</h2>
        <Link
          to="/schedule"
          style={{
            fontSize: "12px",
            color: "#155078",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          View Full Schedule →
        </Link>
      </div>

      <div className="schedule-list">
        {loading ? (
          <div style={{ padding: "24px 12px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            Loading today's schedule...
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => {
            const typeClass =
              appointment.type === "Video"
                ? "video-session"
                : appointment.type === "Chat"
                ? "chat-session"
                : "in-progress";

            return (
              <div className={`schedule-item ${typeClass}`} key={appointment.id}>
                <div className="schedule-time">{appointment.time}</div>

                <div className="schedule-client">
                  <strong>{appointment.client}</strong>

                  <span
                    className={`session-badge ${appointment.type
                      .toLowerCase()
                      .replace("-", "")}`}
                  >
                    {appointment.type === "Video" && <VideoSessionIcon size={12} />}
                    {appointment.type === "Chat" && <MessageSquareIcon size={12} />}
                    {appointment.type === "In-Person" && <UsersIcon size={12} />}
                    <span>{appointment.type}</span>
                  </span>
                </div>

                <Link to="/schedule">
                  <button type="button" className="schedule-action">
                    {appointment.status}
                  </button>
                </Link>
              </div>
            );
          })
        ) : (
          <div style={{ padding: "28px 14px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            No sessions scheduled for today.
          </div>
        )}
      </div>
    </article>
  );
}

export default TodaySchedule;