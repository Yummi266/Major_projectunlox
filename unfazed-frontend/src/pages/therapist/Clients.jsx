import { useState } from "react";
import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import ClientToolbar from "../../components/therapist/ClientToolbar";
import ClientList from "../../components/therapist/ClientList";
import AddClientModal from "../../components/therapist/AddClientModal";
import "../../styles/dashboard.css";
import "../../styles/clients.css";

function Clients() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClientAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setIsAddModalOpen(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="clients-content">
          <ClientToolbar onAddClient={() => setIsAddModalOpen(true)} />
          <ClientList refreshKey={refreshKey} />
        </main>
      </div>

      {isAddModalOpen && (
        <AddClientModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleClientAdded}
        />
      )}
    </div>
  );
}

export default Clients;
