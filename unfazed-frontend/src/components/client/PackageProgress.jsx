import { Link } from "react-router-dom";

function PackageProgress({ progress }) {
  const used = typeof progress?.used === "number" ? progress.used : 2;
  const total = typeof progress?.total === "number" && progress.total > 0 ? progress.total : 6;
  const remaining = typeof progress?.remaining === "number" ? progress.remaining : total - used;
  const percentage = typeof progress?.percentage === "number" ? progress.percentage : Math.round((used / total) * 100);
  const packageName = progress?.name || "Standard Package";

  return (
    <article className="dashboard-card package-progress-card">
      <div className="card-heading">
        <h2>Package & Care Progress</h2>
        <span className="package-badge">{remaining} session{remaining === 1 ? "" : "s"} left</span>
      </div>

      <div className="package-card-body">
        <div className="package-plan-info">
          <div>
            <strong>{packageName}</strong>
            <p>50-minute clinical therapy sessions</p>
          </div>
          <span className="package-fraction">
            {used} / {total} used
          </span>
        </div>

        <div className="package-progress-bar">
          <div
            className="package-progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="package-footer-info">
          <span>{percentage}% utilized</span>
          <Link to="/client/sessions" style={{ textDecoration: "none" }}>
            <button type="button" className="client-action-btn secondary">
              Book Session
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PackageProgress;