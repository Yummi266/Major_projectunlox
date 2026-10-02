import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  CalendarIcon,
  MessageSquareIcon,
  PackageIcon,
  InvoiceIcon,
  SettingsIcon,
} from "../common/Icons";

function ClientSidebar() {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <Link to="/" className="dashboard-brand" title="Back to Unfazed Home">
        <span className="brand-icon">U</span>
        <span className="brand-name">Unfazed</span>
      </Link>

      <nav className="dashboard-nav">
        <Link
          to="/client/dashboard"
          className={`nav-item ${location.pathname === "/client/dashboard" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <DashboardIcon size={16} />
          </span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/client/sessions"
          className={`nav-item ${location.pathname === "/client/sessions" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <CalendarIcon size={16} />
          </span>
          <span>My Sessions</span>
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
          <span>My Package</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-item-icon">
            <InvoiceIcon size={16} />
          </span>
          <span>Invoices</span>
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

export default ClientSidebar;