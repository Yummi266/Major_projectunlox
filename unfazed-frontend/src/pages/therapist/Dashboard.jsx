import { useState, useEffect } from "react";
import axios from "axios";
import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import StatCard from "../../components/therapist/StatCard";
import AttentionCard from "../../components/therapist/AttentionCard";
import RevenueOverview from "../../components/therapist/RevenueOverview";
import TodaySchedule from "../../components/therapist/TodaySchedule";
import ClientPackages from "../../components/therapist/ClientPackages";
import RecentActivity from "../../components/therapist/RecentActivity";
import "../../styles/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    revenue: "₹13,500",
    activeClients: 2,
    sessionsHeld: 3,
    noShowRate: "0.0%"
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/overview");
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview stats:", err);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="dashboard-content">
          {}
          <section className="kpi-row">
            <StatCard
              title="Revenue"
              value={stats.revenue || "₹0"}
              change="+100%"
              changeText="active client packages"
            />

            <StatCard
              title="Active Clients"
              value={stats.activeClients !== undefined ? String(stats.activeClients) : "0"}
              change={`+${stats.activeClients || 0}`}
              changeText="enrolled in directory"
            />

            <StatCard
              title="Sessions Held"
              value={stats.sessionsHeld !== undefined ? String(stats.sessionsHeld) : "0"}
              change={`${stats.sessionsHeld || 0} completed`}
              changeText="client sessions"
            />

            <StatCard
              title="No-show Rate"
              value={stats.noShowRate || "0.0%"}
              change="0.0%"
              changeText="practice attendance"
            />
          </section>

          {}
          <section className="dashboard-row">
            <RevenueOverview />
            <AttentionCard />
          </section>

          {}
          <section className="dashboard-row">
            <TodaySchedule />
            <ClientPackages />
          </section>

          {}
          <section className="activity-row">
            <RecentActivity />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;