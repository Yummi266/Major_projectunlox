import { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, MailIcon, BellIcon, UserIcon } from "../common/Icons";
import { authService } from "../../services/authService";

function DashboardHeader() {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/therapists/profile/current");
        if (res.data?.therapist) {
          setUser(res.data.therapist);
          const currentUser = authService.getUser();
          if (currentUser && (currentUser.id === res.data.therapist._id || currentUser._id === res.data.therapist._id || currentUser.email === res.data.therapist.email)) {
            localStorage.setItem("user", JSON.stringify({ ...currentUser, ...res.data.therapist }));
          }
        }
      } catch {
        // fallback to storage
      }
    };
    syncProfile();

    const handleStorage = () => {
      setUser(authService.getUser());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("profile-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("profile-updated", handleStorage);
    };
  }, []);

  const displayName = user?.name
    ? user.name.startsWith("Dr.")
      ? user.name
      : `Dr. ${user.name}`
    : "Doctor";

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Therapist Dashboard</h1>
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
            placeholder="Search clients, notes, sessions..."
          />
        </div>

        <button className="header-button header-icon-btn" type="button" aria-label="Mail messages" title="2 unread messages">
          <MailIcon size={17} />
          <span className="btn-badge-number">2</span>
        </button>

        <button className="header-button header-icon-btn" type="button" aria-label="Notifications" title="3 new notifications">
          <BellIcon size={17} />
          <span className="btn-badge-number">3</span>
        </button>

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

export default DashboardHeader;