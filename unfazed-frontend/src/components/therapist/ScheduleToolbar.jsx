import { ChevronLeftIcon, ChevronRightIcon } from "../common/Icons";

function ScheduleToolbar({ onAddSession }) {
  return (
    <section className="schedule-toolbar">
      <div className="schedule-toolbar-info">
        <h1>Schedule</h1>
        <p>Manage your clinical sessions, client appointments, and daily availability.</p>
      </div>

      <div className="schedule-toolbar-actions">
        <div className="schedule-segmented-nav">
          <button className="schedule-nav-segment active" type="button">
            Today
          </button>

          <button className="schedule-nav-segment nav-arrow-btn" type="button">
            <ChevronLeftIcon size={13} />
            <span>Previous</span>
          </button>

          <button className="schedule-nav-segment nav-arrow-btn" type="button">
            <span>Next</span>
            <ChevronRightIcon size={13} />
          </button>
        </div>

        <button
          className="schedule-primary-btn"
          type="button"
          onClick={onAddSession}
        >
          + Add Session
        </button>
      </div>
    </section>
  );
}

export default ScheduleToolbar;