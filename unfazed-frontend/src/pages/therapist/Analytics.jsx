import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import DashboardSidebar from "../../components/therapist/DashboardSidebar";
import DashboardHeader from "../../components/therapist/DashboardHeader";
import AnalyticsOverview from "../../components/therapist/AnalyticsOverview";
import "../../styles/analytics.css";

const PERIOD_MAP = {
  "Last 6 months": "6months",
  "Last 30 days": "30days",
  "Last 12 months": "12months"
};

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 months");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (periodLabel) => {
    setLoading(true);
    try {
      const param = PERIOD_MAP[periodLabel] || "6months";
      const res = await axios.get(`http://localhost:5000/api/analytics?period=${param}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod, fetchAnalytics]);

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <main className="analytics-content">
          <div className="analytics-title">
            <div>
              <h1>Analytics</h1>
              <p>Track your practice performance, revenue trends, and client activity.</p>
            </div>

            <select
              className="analytics-period"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 12 months">Last 12 months</option>
            </select>
          </div>

          <AnalyticsOverview
            data={data}
            loading={loading}
            periodLabel={selectedPeriod}
          />
        </main>
      </div>
    </div>
  );
}

export default Analytics;
