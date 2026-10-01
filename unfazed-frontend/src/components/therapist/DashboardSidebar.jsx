import { Link } from "react-router-dom";
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
  return (
    <aside className="dashboard-sidebar">
      <Link to="/" className="dashboard-brand" title="Back to Unfazed Home">
        <span className="brand-icon">U</span>
        <span className="brand-name">Unfazed</span>
      </Link>

      <nav className="dashboard-nav">
        <Link
          to="/dashboard"
          className="nav-item active"
        >
          <span className="nav-item-icon">
            <DashboardIcon size={16} />
          </span>
          <span>Dashboard</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <CalendarIcon size={16} />
          </span>
          <span>Schedule</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <UsersIcon size={16} />
          </span>
          <span>Clients</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <FileTextIcon size={16} />
          </span>
          <span>Notes</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <MessageSquareIcon size={16} />
          </span>
          <span>Messages</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <PackageIcon size={16} />
          </span>
          <span>Packages</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <BarChartIcon size={16} />
          </span>
          <span>Analytics</span>
        </Link>

        <Link to="#" className="nav-item">
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
