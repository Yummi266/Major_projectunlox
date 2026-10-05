import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  MessageSquareIcon,
  PackageIcon,
  BarChartIcon,
  SettingsIcon,
  UserIcon,
} from "../common/Icons";
import { authService } from "../../services/authService";

function DashboardSidebar() {
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <aside className="dashboard-sidebar">
      <Link to="/" className="dashboard-brand" title="Back to Unfazed Home">
        <span className="brand-icon">U</span>
        <span className="brand-name">Unfazed</span>
      </Link>

      <nav className="dashboard-nav" style={{ flex: 1 }}>
        <Link
          to="/dashboard"
          className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <DashboardIcon size={16} />
          </span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/schedule"
          className={`nav-item ${location.pathname === "/schedule" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <CalendarIcon size={16} />
          </span>
          <span>Schedule</span>
        </Link>

        <Link
          to="/clients"
          className={`nav-item ${location.pathname === "/clients" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <UsersIcon size={16} />
          </span>
          <span>Clients</span>
        </Link>

        <Link
          to="/notes"
          className={`nav-item ${location.pathname === "/notes" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <FileTextIcon size={16} />
          </span>
          <span>Notes</span>
        </Link>

        <Link
          to="/messages"
          className={`nav-item ${location.pathname === "/messages" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <MessageSquareIcon size={16} />
          </span>
          <span>Messages</span>
        </Link>

        <Link
          to="/packages"
          className={`nav-item ${location.pathname === "/packages" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <PackageIcon size={16} />
          </span>
          <span>Packages</span>
        </Link>

        <Link
          to="/analytics"
          className={`nav-item ${location.pathname === "/analytics" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <BarChartIcon size={16} />
          </span>
          <span>Analytics</span>
        </Link>

        <Link
          to="/settings"
          className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <SettingsIcon size={16} />
          </span>
          <span>Settings</span>
        </Link>
      </nav>

      <div style={{ paddingTop: "16px", borderTop: "1px solid #c0d8e8", display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          type="button"
          onClick={handleLogout}
          className="nav-item"
          style={{
            background: "transparent",
            border: 0,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            fontSize: "12.5px",
            color: "#6b889c"
          }}
        >
          <span className="nav-item-icon">
            <UserIcon size={14} />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
