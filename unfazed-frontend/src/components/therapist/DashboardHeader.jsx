import { SearchIcon, MailIcon, BellIcon, UserIcon } from "../common/Icons";

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Therapist Dashboard</h1>
        <span className="header-date">September 29, 2026</span>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <SearchIcon size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search clients, notes, sessions..."
          />
        </div>

        <button className="header-button header-icon-btn" type="button" aria-label="Mail messages" title="Messages">
          <MailIcon size={17} />
          <span className="btn-badge-dot"></span>
        </button>

        <button className="header-button header-icon-btn" type="button" aria-label="Notifications" title="Notifications">
          <BellIcon size={17} />
          <span className="btn-badge-dot"></span>
        </button>

        <div className="doctor-profile-wrap">
          <span className="doctor-name">
            Dr. Name
          </span>

          <button className="profile-button" type="button" title="View Profile">
            <UserIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;