import { useState } from "react";
import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import MessageContacts from "../../components/therapist/MessageContacts";
import MessageWindow from "../../components/therapist/MessageWindow";
import "../../styles/dashboard.css";
import "../../styles/messages.css";

function Messages() {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageSent = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="messages-content">
          <div className="messages-title">
            <div>
              <h1>Messages</h1>
              <p>Communicate with your clients securely in real-time.</p>
            </div>
          </div>

          <section className="messages-panel">
            <MessageContacts
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              refreshKey={refreshKey}
            />
            <MessageWindow
              selectedClientId={selectedClientId}
              onMessageSent={handleMessageSent}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Messages;
