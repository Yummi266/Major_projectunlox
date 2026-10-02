import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function formatRelativeTime(dateString) {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/overview");
        if (res.data?.recentActivities && Array.isArray(res.data.recentActivities)) {
          setActivities(res.data.recentActivities);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <article className="dashboard-card activity-card">
      <div className="card-heading">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-list">
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            Loading activity log...
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity, index) => (
            <div className="activity-item" key={index}>
              <div className="activity-time">
                {formatRelativeTime(activity.time)}
              </div>

              <div className="activity-description">
                {activity.action}{" "}
                <Link to={activity.type === "note" ? "/notes" : "/clients"}>
                  <button type="button" style={{ cursor: "pointer" }}>
                    {activity.client}
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            No recent activity recorded yet.
          </div>
        )}
      </div>
    </article>
  );
}

export default RecentActivity;