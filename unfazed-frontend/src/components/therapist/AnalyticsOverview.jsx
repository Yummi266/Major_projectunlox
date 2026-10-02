function AnalyticsOverview({ data, loading, periodLabel = "Last 6 months" }) {
  if (loading) {
    return (
      <div style={{ padding: "60px 16px", textAlign: "center", color: "#6a889d" }}>
        Loading practice analytics from database...
      </div>
    );
  }

  const stats = data?.stats || {
    totalRevenue: "₹0",
    revenueChange: "+0% vs last month",
    activeClients: 0,
    activeClientsChange: "+0 this month",
    sessionsHeld: 0,
    sessionsHeldChange: "+0 this month",
    noShowRate: "0%",
    noShowChange: "0% lower"
  };

  const revenueChart = data?.revenueChart || [];
  const sessionSummary = data?.sessionSummary || {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  };

  const clientActivity = data?.clientActivity || {
    active: 0,
    activePct: 100,
    new: 0,
    newPct: 0,
    completed: 0,
    completedPct: 0
  };

  const practiceOverview = data?.practiceOverview || {
    averageSessionsPerClient: "0.0",
    packageUtilization: "0%",
    clientRetention: "100%"
  };

  // Determine dynamic Y-axis values based on chart data
  const revenues = revenueChart.map((r) => r.revenue || 0);
  const maxRev = Math.max(...revenues, 15000);
  const yAxis = [
    `₹${Math.round(maxRev / 1000)}k`,
    `₹${Math.round((maxRev * 0.75) / 1000)}k`,
    `₹${Math.round((maxRev * 0.5) / 1000)}k`,
    `₹${Math.round((maxRev * 0.25) / 1000)}k`,
    "₹0"
  ];

  return (
    <div className="analytics-wrapper">
      {/* 4 Top KPI Cards */}
      <section className="analytics-stats">
        <div className="analytics-stat-card">
          <span>Total Revenue</span>
          <strong>{stats.totalRevenue}</strong>
          <small>{stats.revenueChange}</small>
        </div>

        <div className="analytics-stat-card">
          <span>Active Clients</span>
          <strong>{stats.activeClients}</strong>
          <small>{stats.activeClientsChange}</small>
        </div>

        <div className="analytics-stat-card">
          <span>Sessions Held</span>
          <strong>{stats.sessionsHeld}</strong>
          <small>{stats.sessionsHeldChange}</small>
        </div>

        <div className="analytics-stat-card">
          <span>No-show Rate</span>
          <strong>{stats.noShowRate}</strong>
          <small>{stats.noShowChange}</small>
        </div>
      </section>

      {/* Main Grid: Revenue Trend + Session Summary */}
      <section className="analytics-main-grid">
        <div className="analytics-card revenue-chart-card">
          <div className="analytics-card-header">
            <div>
              <h2>Revenue Trend</h2>
              <span>Revenue over the {periodLabel.toLowerCase()}</span>
            </div>
          </div>

          <div className="revenue-chart">
            <div className="chart-y-axis">
              {yAxis.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))}
            </div>

            <div className="chart-area">
              <div className="chart-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="chart-bars">
                {revenueChart.map((item) => (
                  <div
                    className="chart-column"
                    key={item.month}
                    title={`${item.month}: ${item.formattedRevenue || '₹0'}`}
                  >
                    <div className="chart-tooltip">
                      {item.formattedRevenue}
                    </div>

                    <div
                      className="chart-bar"
                      style={{
                        height: `${item.value}%`
                      }}
                    ></div>

                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card session-summary-card">
          <div className="analytics-card-header">
            <div>
              <h2>Session Summary</h2>
              <span>Active period breakdown</span>
            </div>
          </div>

          <div className="session-summary">
            <div className="summary-item">
              <span>Scheduled</span>
              <strong>{sessionSummary.scheduled}</strong>
            </div>

            <div className="summary-item">
              <span>Completed</span>
              <strong>{sessionSummary.completed}</strong>
            </div>

            <div className="summary-item">
              <span>Cancelled</span>
              <strong>{sessionSummary.cancelled}</strong>
            </div>

            <div className="summary-item">
              <span>No-show</span>
              <strong>{sessionSummary.noShow}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Client Activity + Practice Overview */}
      <section className="analytics-bottom-grid">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Client Activity</h2>
              <span>Current client distribution</span>
            </div>
          </div>

          <div className="client-activity">
            <div className="activity-bar">
              <span>Active</span>
              <div>
                <i style={{ width: `${clientActivity.activePct}%` }}></i>
              </div>
              <strong>{clientActivity.active}</strong>
            </div>

            <div className="activity-bar">
              <span>New</span>
              <div>
                <i style={{ width: `${clientActivity.newPct}%` }}></i>
              </div>
              <strong>{clientActivity.new}</strong>
            </div>

            <div className="activity-bar">
              <span>Completed</span>
              <div>
                <i style={{ width: `${clientActivity.completedPct}%` }}></i>
              </div>
              <strong>{clientActivity.completed}</strong>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Practice Overview</h2>
              <span>Current performance</span>
            </div>
          </div>

          <div className="practice-overview">
            <div>
              <span>Average sessions / client</span>
              <strong>{practiceOverview.averageSessionsPerClient}</strong>
            </div>

            <div>
              <span>Package utilization</span>
              <strong>{practiceOverview.packageUtilization}</strong>
            </div>

            <div>
              <span>Client retention</span>
              <strong>{practiceOverview.clientRetention}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AnalyticsOverview;
