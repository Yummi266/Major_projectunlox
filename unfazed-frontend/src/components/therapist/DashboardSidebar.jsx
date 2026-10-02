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
} from "../common/Icons";

function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <Link to="/" className="dashboard-brand" title="Back to Unfazed Home">
        <span className="brand-icon">U</span>
        <span className="brand-name">Unfazed</span>
      </Link>

      <nav className="dashboard-nav">
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
    </aside>
  );
}

export default DashboardSidebar;
