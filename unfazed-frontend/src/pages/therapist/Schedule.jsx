import { useState } from "react";
import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import ScheduleToolbar from "../../components/therapist/ScheduleToolbar";
import ScheduleList from "../../components/therapist/ScheduleList";
import AddSessionModal from "../../components/therapist/AddSessionModal";
import "../../styles/schedule.css";

function Schedule() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setIsAddModalOpen(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="schedule-content">
          <ScheduleToolbar onAddSession={() => setIsAddModalOpen(true)} />
          <ScheduleList refreshKey={refreshKey} />
        </main>
      </div>

      {isAddModalOpen && (
        <AddSessionModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleSessionAdded}
        />
      )}
    </div>
  );
}

export default Schedule;