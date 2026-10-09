function AnalyticsOverview() {
    const revenue = [
        { month: "May", value: 52 },
        { month: "Jun", value: 68 },
        { month: "Jul", value: 61 },
        { month: "Aug", value: 78 },
        { month: "Sep", value: 72 },
        { month: "Oct", value: 88 }
    ];

    return (
        <div className="analytics-wrapper">

            <section className="analytics-stats">

                <div className="analytics-stat-card">
                    <span>Total Revenue</span>
                    <strong>₹184,200</strong>
                    <small>+12.4% vs last month</small>
                </div>

                <div className="analytics-stat-card">
                    <span>Active Clients</span>
                    <strong>18</strong>
                    <small>+3 this month</small>
                </div>

                <div className="analytics-stat-card">
                    <span>Sessions Held</span>
                    <strong>42</strong>
                    <small>+8 this month</small>
                </div>

                <div className="analytics-stat-card">
                    <span>No-show Rate</span>
                    <strong>4.2%</strong>
                    <small>1.1% lower</small>
                </div>

            </section>

            <section className="analytics-main-grid">

                <div className="analytics-card revenue-chart-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Revenue Trend</h2>
                            <span>Revenue over the last 6 months</span>
                        </div>
                    </div>

                    <div className="revenue-chart">

                        <div className="chart-y-axis">
                            <span>₹20k</span>
                            <span>₹15k</span>
                            <span>₹10k</span>
                            <span>₹5k</span>
                            <span>₹0</span>
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
                                {revenue.map((item) => (
                                    <div className="chart-column" key={item.month}>
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
                            <span>This month</span>
                        </div>
                    </div>

                    <div className="session-summary">

                        <div className="summary-item">
                            <span>Scheduled</span>
                            <strong>46</strong>
                        </div>

                        <div className="summary-item">
                            <span>Completed</span>
                            <strong>42</strong>
                        </div>

                        <div className="summary-item">
                            <span>Cancelled</span>
                            <strong>2</strong>
                        </div>

                        <div className="summary-item">
                            <span>No-show</span>
                            <strong>2</strong>
                        </div>

                    </div>
                </div>

            </section>

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
                                <i style={{ width: "78%" }}></i>
                            </div>
                            <strong>18</strong>
                        </div>

                        <div className="activity-bar">
                            <span>New</span>
                            <div>
                                <i style={{ width: "35%" }}></i>
                            </div>
                            <strong>6</strong>
                        </div>

                        <div className="activity-bar">
                            <span>Completed</span>
                            <div>
                                <i style={{ width: "52%" }}></i>
                            </div>
                            <strong>9</strong>
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
                            <strong>4.7</strong>
                        </div>

                        <div>
                            <span>Package utilization</span>
                            <strong>76%</strong>
                        </div>

                        <div>
                            <span>Client retention</span>
                            <strong>89%</strong>
                        </div>

                    </div>
                </div>

            </section>

        </div>
    );
}

export default AnalyticsOverview;