import { SearchIcon, UserIcon } from "../common/Icons";
import NotificationDropdown from "../common/NotificationDropdown";
import { authService } from "../../services/authService";

function ClientHeader() {
  const user = authService.getUser();
  const displayName = user?.name || "Client";

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Client Dashboard</h1>
        <span className="header-date">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
        </span>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <SearchIcon size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search sessions, appointments, notes..."
          />
        </div>

        <NotificationDropdown />

        <div className="doctor-profile-wrap">
          <span className="doctor-name">
            {displayName}
          </span>

          <button
            className="profile-button"
            type="button"
            onClick={handleLogout}
            title="Log out"
            style={{ cursor: "pointer" }}
          >
            <UserIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;