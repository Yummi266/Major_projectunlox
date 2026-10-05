function SessionList({ upcoming = [], completed = [], loading = false }) {
  if (loading) {
    return (
      <div style={{ padding: "48px 16px", textAlign: "center", color: "#688496" }}>
        Loading your sessions from database...
      </div>
    );
  }

  return (
    <div className="sessions-wrapper">
      {}
      <section className="sessions-card">
        <div className="sessions-card-header">
          <div>
            <h2>Upcoming Sessions</h2>
            <span>
              {upcoming.length} session{upcoming.length === 1 ? "" : "s"} scheduled
            </span>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <div
            style={{
              padding: "28px 16px",
              textAlign: "center",
              background: "#f8fbfd",
              borderRadius: "10px",
              border: "1px dashed #d6e5ef",
              color: "#6c899c",
              fontSize: "13px"
            }}
          >
            No upcoming sessions scheduled. Click "+ Book Session" to schedule your next appointment.
          </div>
        ) : (
          <div className="session-items">
            {upcoming.map((item) => (
              <article className="client-session-item upcoming" key={item.id}>
                <div className="session-date-box">
                  <strong>{item.dateFormatted}</strong>
                  <span>{item.time}</span>
                </div>

                <div className="client-session-info">
                  <strong>{item.topic}</strong>
                  <span>with {item.therapistName} ({item.type} Session)</span>
                </div>

                <span className="session-status upcoming-status">
                  Confirmed
                </span>

                <button type="button" className="join-btn">
                  {item.type === "Chat" ? "Open Chat" : "Join Call"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {}
      <section className="sessions-card">
        <div className="sessions-card-header">
          <div>
            <h2>Completed Sessions & Care History</h2>
            <span>
              {completed.length} past session{completed.length === 1 ? "" : "s"} recorded
            </span>
          </div>
        </div>

        {completed.length === 0 ? (
          <div
            style={{
              padding: "28px 16px",
              textAlign: "center",
              background: "#f8fbfd",
              borderRadius: "10px",
              border: "1px dashed #d6e5ef",
              color: "#6c899c",
              fontSize: "13px"
            }}
          >
            No completed sessions recorded yet.
          </div>
        ) : (
          <div className="session-items">
            {completed.map((item) => (
              <article className="client-session-item" key={item.id}>
                <div className="session-date-box">
                  <strong>{item.dateFormatted}</strong>
                  <span>{item.time}</span>
                </div>

                <div className="client-session-info">
                  <strong>{item.topic}</strong>
                  <span>with {item.therapistName} ({item.type} Session)</span>
                </div>

                <span className="session-status completed-status">
                  Completed
                </span>

                <button type="button" className="details-btn">
                  Summary
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SessionList;
