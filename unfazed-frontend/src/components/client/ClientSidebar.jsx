import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  CalendarIcon,
  MessageSquareIcon,
  PackageIcon,
  InvoiceIcon,
  UserIcon,
} from "../common/Icons";
import { authService } from "../../services/authService";

function ClientSidebar() {
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

        <Link
          to="/client/messages"
          className={`nav-item ${location.pathname === "/client/messages" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <MessageSquareIcon size={16} />
          </span>
          <span>Messages</span>
        </Link>

        <Link
          to="/client/package"
          className={`nav-item ${location.pathname === "/client/package" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <PackageIcon size={16} />
          </span>
          <span>My Package</span>
        </Link>

        <Link
          to="/client/invoices"
          className={`nav-item ${location.pathname === "/client/invoices" ? "active" : ""}`}
        >
          <span className="nav-item-icon">
            <InvoiceIcon size={16} />
          </span>
          <span>Invoices</span>
        </Link>
      </nav>

      {/* Portal Switcher & Logout at sidebar bottom */}
      <div style={{ paddingTop: "16px", borderTop: "1px solid #c0d8e8", display: "flex", flexDirection: "column", gap: "6px" }}>
        <Link
          to="/dashboard"
          className="nav-item"
          title="Switch to Therapist Workspace"
          style={{ fontSize: "12.5px", background: "rgba(21, 80, 120, 0.08)" }}
        >
          <span className="nav-item-icon">⇄</span>
          <span>Therapist View</span>
        </Link>

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

export default ClientSidebar;