import { useState, useEffect } from "react";
import axios from "axios";
import { authService } from "../../services/authService";

function SettingsForm() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "Clinical Psychology",
    qualification: "M.Phil Clinical Psychology",
    experience: "5",
    bio: "",
    practiceName: "Unfazed Wellness & Therapy",
    defaultSessionDuration: "50 min",
    emailNotifications: true,
    sessionReminders: true
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch real profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("http://localhost:5000/api/therapists/profile/current", {
          headers
        });

        if (res.data?.therapist) {
          const t = res.data.therapist;
          setProfile({
            name: t.name || "",
            email: t.email || "",
            phone: t.phone || "",
            specialization: t.specialization || "Clinical Psychology",
            qualification: t.qualification || "M.Phil Clinical Psychology",
            experience: t.experience !== undefined ? String(t.experience) : "5",
            bio: t.bio || "",
            practiceName: t.practiceName || "Unfazed Wellness & Therapy",
            defaultSessionDuration: t.defaultSessionDuration || "50 min",
            emailNotifications: t.emailNotifications !== false,
            sessionReminders: t.sessionReminders !== false
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (activeTab === "Security") {
        if (!security.currentPassword || !security.newPassword) {
          setErrorMsg("Please fill in both current and new passwords.");
          setSaving(false);
          return;
        }
        if (security.newPassword !== security.confirmPassword) {
          setErrorMsg("New password and confirmation do not match.");
          setSaving(false);
          return;
        }

        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.put(
          "http://localhost:5000/api/therapists/security/change-password",
          {
            currentPassword: security.currentPassword,
            newPassword: security.newPassword
          },
          { headers }
        );

        setSuccessMsg("Password changed successfully!");
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.put(
          "http://localhost:5000/api/therapists/profile/current",
          profile,
          { headers }
        );

        // Update stored user in localStorage so DashboardHeader immediately updates
        if (res.data?.therapist) {
          const currentUser = authService.getUser() || {};
          const updatedUser = {
            ...currentUser,
            name: res.data.therapist.name,
            email: res.data.therapist.email,
            specialization: res.data.therapist.specialization
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("profile-updated"));
        }

        setSuccessMsg("Profile and practice preferences saved successfully!");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Avatar initials
  const initials = profile.name
    ? profile.name
        .replace(/^Dr\.\s*/i, "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TH";

  if (loading) {
    return (
      <div style={{ padding: "60px 16px", textAlign: "center", color: "#6a889d" }}>
        Loading profile settings from database...
      </div>
    );
  }

  return (
    <div className="settings-layout">
      {/* Settings Navigation Menu */}
      <aside className="settings-menu">
        {["Profile", "Practice", "Notifications", "Security"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`settings-menu-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setSuccessMsg("");
              setErrorMsg("");
            }}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* Main Settings Card */}
      <section className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>
              {activeTab === "Profile" && "Profile Information"}
              {activeTab === "Practice" && "Practice & Clinical Preferences"}
              {activeTab === "Notifications" && "Notification Preferences"}
              {activeTab === "Security" && "Account Security"}
            </h2>
            <p>
              {activeTab === "Profile" && "Update your professional contact and clinical credentials."}
              {activeTab === "Practice" && "Manage your clinic brand, default consultation duration, and focus areas."}
              {activeTab === "Notifications" && "Choose how and when you receive client appointment notifications."}
              {activeTab === "Security" && "Manage your login password and active session security."}
            </p>
          </div>

          <div className="settings-profile-avatar" title={profile.name}>
            {initials}
          </div>
        </div>

        {successMsg && (
          <div className="settings-alert settings-alert-success">
            ✓ {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="settings-alert settings-alert-error">
            ✕ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TAB 1: PROFILE */}
          {activeTab === "Profile" && (
            <div className="settings-form-grid">
              <div className="settings-field">
                <label>Full Name *</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Sarah Sharma"
                  required
                />
              </div>

              <div className="settings-field">
                <label>Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="sarah@example.com"
                  required
                />
              </div>

              <div className="settings-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="settings-field">
                <label>Clinical Specialization</label>
                <input
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Clinical Psychology, CBT, Trauma"
                />
              </div>

              <div className="settings-field">
                <label>Qualifications</label>
                <input
                  name="qualification"
                  value={profile.qualification}
                  onChange={handleChange}
                  placeholder="e.g. M.Phil Clinical Psychology"
                />
              </div>

              <div className="settings-field">
                <label>Experience (Years)</label>
                <input
                  name="experience"
                  type="number"
                  min="0"
                  value={profile.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-field full-width">
                <label>Professional Bio / Clinical Summary</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Brief summary of your clinical therapeutic philosophy and focus areas..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRACTICE */}
          {activeTab === "Practice" && (
            <div className="settings-form-grid">
              <div className="settings-field full-width">
                <label>Practice / Clinic Name</label>
                <input
                  name="practiceName"
                  value={profile.practiceName}
                  onChange={handleChange}
                  placeholder="e.g. Unfazed Wellness & Therapy"
                />
              </div>

              <div className="settings-field">
                <label>Default Session Duration</label>
                <select
                  name="defaultSessionDuration"
                  value={profile.defaultSessionDuration}
                  onChange={handleChange}
                >
                  <option value="45 min">45 min</option>
                  <option value="50 min">50 min</option>
                  <option value="60 min">60 min</option>
                  <option value="90 min">90 min</option>
                </select>
              </div>

              <div className="settings-field">
                <label>Consultation Modalities</label>
                <input
                  type="text"
                  readOnly
                  value="Video, Chat, In-Person (Enabled)"
                  style={{ background: "#f8fbfd", color: "#6a889d" }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div>
              <div className="settings-toggle-item">
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive email updates when clients book or reschedule sessions.</p>
                </div>
                <button
                  type="button"
                  className={`settings-toggle-btn ${profile.emailNotifications ? "active" : ""}`}
                  onClick={() =>
                    setProfile((p) => ({ ...p, emailNotifications: !p.emailNotifications }))
                  }
                  aria-label="Toggle email notifications"
                >
                  <span></span>
                </button>
              </div>

              <div className="settings-toggle-item">
                <div>
                  <strong>Session Reminders</strong>
                  <p>Send automatic appointment reminders 1 hour before scheduled sessions.</p>
                </div>
                <button
                  type="button"
                  className={`settings-toggle-btn ${profile.sessionReminders ? "active" : ""}`}
                  onClick={() =>
                    setProfile((p) => ({ ...p, sessionReminders: !p.sessionReminders }))
                  }
                  aria-label="Toggle session reminders"
                >
                  <span></span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "Security" && (
            <div className="settings-form-grid">
              <div className="settings-field full-width">
                <label>Current Password *</label>
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={security.currentPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>

              <div className="settings-field">
                <label>New Password *</label>
                <input
                  name="newPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={security.newPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>

              <div className="settings-field">
                <label>Confirm New Password *</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="settings-divider"></div>

          <div className="settings-actions">
            <button
              type="button"
              className="settings-cancel-btn"
              onClick={() => {
                setSuccessMsg("");
                setErrorMsg("");
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="settings-save-btn"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SettingsForm;
