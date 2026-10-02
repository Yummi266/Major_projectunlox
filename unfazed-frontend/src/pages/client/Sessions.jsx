import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import SessionList from "../../components/client/SessionList";
import BookSessionModal from "../../components/client/BookSessionModal";
import { authService } from "../../services/authService";
import "../../styles/dashboard.css";
import "../../styles/client-sessions.css";

function Sessions() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:5000/api/appointments/client-sessions", {
        headers
      });

      if (res.data) {
        setUpcoming(res.data.upcoming || []);
        setCompleted(res.data.completed || []);
      }
    } catch (err) {
      console.error("Failed to load client sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="dashboard-page">
      <ClientSidebar />

      <div className="dashboard-main">
        <ClientHeader />

        <main className="client-sessions-content">
          <div className="client-page-title">
            <div>
              <h1>My Sessions</h1>
              <p>View and manage your upcoming and completed therapy appointments.</p>
            </div>

            <button
              type="button"
              className="book-session-btn"
              onClick={() => setIsBookModalOpen(true)}
            >
              + Book Session
            </button>
          </div>

          <SessionList
            upcoming={upcoming}
            completed={completed}
            loading={loading}
          />
        </main>
      </div>

      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBooked={fetchSessions}
      />
    </div>
  );
}

export default Sessions;
