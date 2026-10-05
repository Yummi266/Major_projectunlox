import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import ClientMessageWindow from "../../components/client/ClientMessageWindow";
import { authService } from "../../services/authService";
import { CalendarIcon, ShieldLockIcon, ClockIcon } from "../../components/common/Icons";

import "../../styles/dashboard.css";
import "../../styles/client-messages.css";

function ClientMessages() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("http://localhost:5000/api/dashboard/client", { headers });
        if (res.data) {
          setClientData(res.data);
        }
      } catch (err) {
        console.error("Failed to load client details for messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, []);

  const authUser = authService.getUser();
  const therapist = clientData?.therapist || {
    name: "Your Therapist",
    specialization: "Relationship Counseling & CBT",
  };

  const clientId = clientData?.client?.id || authUser?.id || authUser?._id;

  const initials = therapist.name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TW";

  return (
    <div className="dashboard-page">
      <ClientSidebar />

      <div className="dashboard-main">
        <ClientHeader />

        <main className="client-messages-content">
          <div className="client-page-title">
            <div>
              <h1>Direct Messages</h1>
              <p>Communicate privately with your therapist between scheduled sessions.</p>
            </div>

            <Link to="/client/sessions" style={{ textDecoration: "none" }}>
              <button className="book-session-btn" type="button">
                <CalendarIcon size={14} />
                <span>Book Next Session</span>
              </button>
            </Link>
          </div>

          <div className="client-messages-layout">
            {}
            <ClientMessageWindow
              clientId={clientId}
              therapistInfo={therapist}
            />

            {}
            <aside className="client-messages-sidebar">
              <div className="care-info-card">
                <h4>Your Care Provider</h4>
                <div className="care-therapist-preview">
                  <div className="preview-avatar">{initials}</div>
                  <div>
                    <strong>{therapist.name}</strong>
                    <span>{therapist.specialization}</span>
                  </div>
                </div>

                <div className="care-policy-note">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: "600", color: "#174d73" }}>
                    <ClockIcon size={13} />
                    <span>Office & Response Hours</span>
                  </div>
                  {therapist.name} reviews messages Monday through Saturday, 9:00 AM – 7:00 PM. Non-urgent replies typically arrive within 2–4 hours.
                </div>

                <Link to="/client/sessions" className="quick-action-link">
                  Schedule Live Video Call
                </Link>
                <Link to="/client/package" className="quick-action-link" style={{ marginTop: "8px" }}>
                  View Remaining Sessions
                </Link>
              </div>

              <div className="crisis-box">
                <strong>Need immediate assistance?</strong>
                <p>
                  In-app messaging is not monitored 24/7 for crisis interventions. If you are experiencing a mental health emergency, please contact the National Tele-MANAS hotline at <strong>14416</strong> or your local emergency care hospital.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClientMessages;
