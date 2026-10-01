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
  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="dashboard-content">

          {/* TOP: 4 KPI CARDS */}
          <section className="kpi-row">
            <StatCard
              title="Revenue"
              value="₹184,200"
              change="+12.4%"
              changeText="vs last month"
            />

            <StatCard
              title="Active Client"
              value="18"
              change="+3"
              changeText="this month"
            />

            <StatCard
              title="Sessions Held"
              value="42"
              change="+8"
              changeText="this month"
            />

            <StatCard
              title="No-show Rate"
              value="4.2%"
              change="-1.1%"
              changeText="vs last month"
            />
          </section>

          {/* ROW 2 */}
          <section className="dashboard-row">
            <RevenueOverview />
            <AttentionCard />
          </section>

          {/* ROW 3 */}
          <section className="dashboard-row">
            <TodaySchedule />
            <ClientPackages />
          </section>

          {/* ROW 4 - FULL WIDTH */}
          <section className="activity-row">
            <RecentActivity />
          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;