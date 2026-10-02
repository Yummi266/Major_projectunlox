import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import SettingsForm from "../../components/therapist/SettingsForm";
import "../../styles/settings.css";

function Settings() {
  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="settings-content">
          <div className="settings-title">
            <h1>Settings</h1>
            <p>Manage your professional therapist profile and practice preferences.</p>
          </div>

          <SettingsForm />
        </main>
      </div>
    </div>
  );
}

export default Settings;
