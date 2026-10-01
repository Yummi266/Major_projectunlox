function UpcomingSession() {
  return (
    <div className="upcoming-session">

      <div className="therapist-photo">
        Photo
      </div>

      <div className="session-info">
        <span className="session-time">
          Tomorrow, 6:00–6:50 PM
        </span>

        <h2>Dr. Name Surname</h2>

        <div className="session-actions">
          <button className="join-session">
            Join session
          </button>

          <button className="reschedule-session">
            Reschedule
          </button>
        </div>
      </div>

    </div>
  );
}

export default UpcomingSession;