function RecentActivity() {
  const activities = [
    {
      time: "2 hours ago",
      action: "You messaged",
      client: "Sarah Wilson",
    },
    {
      time: "4 hours ago",
      action: "You checked",
      client: "Michael Lee",
    },
    {
      time: "Yesterday",
      action: "Payment received from",
      client: "Daniel Smith",
    },
    {
      time: "Yesterday",
      action: "Session note updated for",
      client: "Emily Davis",
    },
  ];

  return (
    <article className="dashboard-card activity-card">

      <div className="card-heading">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-list">

        {activities.map((activity, index) => (
          <div className="activity-item" key={index}>

            <div className="activity-time">
              {activity.time}
            </div>

            <div className="activity-description">
              {activity.action}{" "}
              <button type="button">
                {activity.client}
              </button>
            </div>

          </div>
        ))}

      </div>

    </article>
  );
}

export default RecentActivity;