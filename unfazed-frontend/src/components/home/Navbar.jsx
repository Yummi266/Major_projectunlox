import { Link } from "react-router-dom";
import { DashboardIcon } from "../common/Icons";

function Navbar() {
  return (
    <header className="home-navbar">
      <Link to="/" className="home-brand">
        <span className="home-brand-icon">
          U
        </span>
        <span>
          Unfazed
        </span>
      </Link>

      <nav className="home-nav">
        <a href="#how-it-works">
          How it works
        </a>
        <a href="#therapists">
          Therapists
        </a>
        <a href="#pricing">
          Pricing
        </a>
        <a href="#support">
          Support
        </a>
      </nav>

      <div className="home-nav-actions">
        <Link
          to="/dashboard"
          className="nav-dashboard-link"
          title="Open Therapist Dashboard"
        >
          <DashboardIcon size={14} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/login"
          className="nav-signin"
        >
          Sign in
        </Link>

        <Link
          to="/register"
          className="nav-get-started"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
