import { VideoSessionIcon, MessageSquareIcon, UsersIcon } from "../common/Icons";

function TodaySchedule() {
  const appointments = [
    {
      time: "10:00 AM – 10:50 AM",
      client: "Sarah Wilson",
      type: "Video",
      status: "Join Call",
    },
    {
      time: "11:30 AM – 12:20 PM",
      client: "Michael Lee",
      type: "Chat",
      status: "Open Room",
    },
    {
      time: "02:00 PM – 02:50 PM",
      client: "Daniel Smith",
      type: "Video",
      status: "Join Call",
    },
    {
      time: "04:00 PM – 04:50 PM",
      client: "Emily Davis",
      type: "In-Person",
      status: "Open Session",
    },
  ];

  return (
    <article className="dashboard-card schedule-card">
      <div className="card-heading">
        <h2>Today's Schedule</h2>
      </div>

      <div className="schedule-list">
        {appointments.map((appointment, index) => {
          const typeClass =
            appointment.type === "Video"
              ? "video-session"
              : appointment.type === "Chat"
              ? "chat-session"
              : "in-progress";

          return (
            <div className={`schedule-item ${typeClass}`} key={index}>
            <div className="schedule-time">
              {appointment.time}
            </div>

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

            <button
              type="button"
              className="schedule-action"
            >
              {appointment.status}
            </button>
          </div>
          );
        })}
      </div>
    </article>
  );
}

export default TodaySchedule;