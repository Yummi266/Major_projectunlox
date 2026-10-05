import { useState, useEffect } from "react";
import axios from "axios";

function RevenueOverview() {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/overview");
        if (res.data?.revenueTrend && Array.isArray(res.data.revenueTrend)) {
          setTrend(res.data.revenueTrend);
        } else {
          setTrend([]);
        }
      } catch (err) {
        console.error("Failed to load revenue trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  const revenues = trend.map((t) => t.revenue || 0);
  const maxRev = Math.max(...revenues, 15000);

  const yAxisTicks = [
    `₹${Math.round(maxRev / 1000)}k`,
    `₹${Math.round((maxRev * 0.66) / 1000)}k`,
    `₹${Math.round((maxRev * 0.33) / 1000)}k`,
    "₹0"
  ];

  const chartWidth = 500;
  const chartHeight = 180;
  const bottomY = 150;
  const topY = 25;
  const usableHeight = bottomY - topY;

  const points = trend.map((item, idx) => {
    const x = trend.length > 1 ? Math.round((idx / (trend.length - 1)) * chartWidth) : 0;
    const ratio = maxRev > 0 ? (item.revenue || 0) / maxRev : 0;
    const y = Math.round(bottomY - ratio * usableHeight);
    return { x, y, month: item.month, revenue: item.revenue || 0 };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <article className="dashboard-card revenue-card">
      <div className="card-heading">
        <h2>Revenue, Last 6 Months</h2>
      </div>

      <div className="revenue-chart">
        <div className="chart-y-axis">
          {yAxisTicks.map((tick, i) => (
            <span key={i}>{tick}</span>
          ))}
        </div>

        <div className="chart-area" style={{ position: "relative" }}>
          <div className="chart-grid-line line-one"></div>
          <div className="chart-grid-line line-two"></div>
          <div className="chart-grid-line line-three"></div>
          <div className="chart-grid-line line-four"></div>

          {loading ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b8699",
                fontSize: "13px"
              }}
            >
              Loading revenue trend...
            </div>
          ) : points.length > 0 ? (
            <>
              <svg
                className="revenue-line"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#174d73"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.month === p.month ? "6.5" : "4.5"}
                    fill="#ffffff"
                    stroke="#174d73"
                    strokeWidth="3"
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {hoveredPoint && (
                <div
                  style={{
                    position: "absolute",
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                    top: `${Math.max(10, (hoveredPoint.y / chartHeight) * 100 - 24)}%`,
                    transform: "translateX(-50%)",
                    background: "#174d73",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    fontSize: "11px",
                    fontWeight: 600,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
                  }}
                >
                  {hoveredPoint.month}: ₹{hoveredPoint.revenue.toLocaleString()}
                </div>
              )}
            </>
          ) : null}

          <div className="chart-months">
            {points.map((p, idx) => (
              <span key={idx}>{p.month}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default RevenueOverview;