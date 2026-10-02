import { Link } from "react-router-dom";


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
