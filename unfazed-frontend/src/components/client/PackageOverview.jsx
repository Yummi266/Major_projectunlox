import { Link } from "react-router-dom";

function PackageOverview({ packageProgress, therapistName = "your care provider" }) {
  const used = typeof packageProgress?.used === "number" ? packageProgress.used : 2;
  const total = typeof packageProgress?.total === "number" && packageProgress.total > 0 ? packageProgress.total : 6;
  const remaining = typeof packageProgress?.remaining === "number" ? packageProgress.remaining : Math.max(0, total - used);
  const percentage = typeof packageProgress?.percentage === "number" ? packageProgress.percentage : Math.round((used / total) * 100);
  const packageName = packageProgress?.name || "Standard Care Package";

  return (
    <section className="active-package-hero">
      <div className="hero-plan-meta">
        <span className="plan-badge">Active Care Plan</span>
        <h2>{packageName}</h2>
        <p>
          Customized clinical therapy care with {therapistName}. All consultations include private video sessions, intake reviews, and between-session reflections.
        </p>

        <div className="hero-plan-features">
          <div className="hero-feature-pill">
            <span></span>
            <strong>50-Minute</strong> Video & Audio Sessions
          </div>
          <div className="hero-feature-pill">
            <span></span>
            Direct encrypted messaging access
          </div>
          <div className="hero-feature-pill">
            <span></span>
            Free rescheduling up to 24h before
          </div>
        </div>
      </div>

      <div className="hero-progress-block">
        <div className="hero-progress-numbers">
          <span className="big-num">{remaining}</span>
          <span className="sub-num">
            of <strong>{total}</strong> sessions left
          </span>
        </div>

        <div className="hero-bar-track">
          <div
            className="hero-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <Link to="/client/sessions" style={{ textDecoration: "none" }}>
          <button className="hero-action-btn" type="button">
            Book Next Session ({remaining} Available)
          </button>
        </Link>
      </div>
    </section>
  );
}

export default PackageOverview;
