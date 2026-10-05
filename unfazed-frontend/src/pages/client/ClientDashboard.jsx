import { useState, useEffect } from "react";
import axios from "axios";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";
import StatCard from "../../components/therapist/StatCard";
import UpcomingSession from "../../components/client/UpcomingSession";
import FeelingCheckIn from "../../components/client/FeelingCheckIn";
import PackageProgress from "../../components/client/PackageProgress";
import TherapistMessage from "../../components/client/TherapistMessage";
import ClientActivity from "../../components/client/ClientActivity";
import { authService } from "../../services/authService";

import "../../styles/dashboard.css";
import "../../styles/client-dashboard.css";

function ClientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDashboard = async () => {
      setLoading(true);
      try {
        const token = authService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("http://localhost:5000/api/dashboard/client", {
          headers
        });

        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load client dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDashboard();
  }, []);

  const stats = data?.stats || {
    sessionsCompleted: 2,
    nextSessionDate: "Oct 3",
    nextSessionTime: "6:00 PM",
    therapistName: data?.therapist?.name || "Therapist",
    activePackage: "2 / 6 Used",
    packageRemaining: "4 left",
    packageRemainingPct: "67% remaining",
    wellnessStreak: "8 Days"
  };

  return (
    <div className="dashboard-page">
      <ClientSidebar />

      <div className="dashboard-main">
        <ClientHeader />

        <main className="dashboard-content">
          {}
          <section className="kpi-row">
            <StatCard
              title="Sessions Completed"
              value={String(stats.sessionsCompleted)}
              change={`${stats.sessionsCompleted} verified`}
              changeText="in current package"
            />

            <StatCard
              title="Next Session"
              value={stats.nextSessionDate}
              change={stats.nextSessionTime}
              changeText={`with ${stats.therapistName}`}
            />

            <StatCard
              title="Active Package"
              value={stats.activePackage}
              change={stats.packageRemaining}
              changeText={stats.packageRemainingPct}
            />

            <StatCard
              title="Wellness Streak"
              value={stats.wellnessStreak}
              change="+1 today"
              changeText="consistent check-ins"
            />
          </section>

          {}
          <section className="dashboard-row">
            <UpcomingSession
              session={data?.upcomingSession}
              therapist={data?.therapist}
            />
            <FeelingCheckIn />
          </section>

          {}
          <section className="dashboard-row">
            <PackageProgress progress={data?.packageProgress} />
            <TherapistMessage message={data?.therapistMessage} />
          </section>

          {}
          <section className="activity-row">
            <ClientActivity activities={data?.recentActivities} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default ClientDashboard;