import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PackageSessions({ packageProgress, onPackageSelected }) {
  const total = typeof packageProgress?.total === "number" && packageProgress.total > 0 ? packageProgress.total : 6;
  const used = typeof packageProgress?.used === "number" ? packageProgress.used : 2;

  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/packages");
        if (res.data?.packages) {
          setAvailablePackages(res.data.packages);
        }
      } catch (err) {
        console.error("Failed to load available packages:", err);
      }
    };
    fetchPackages();
  }, []);

  const sessionSlots = Array.from({ length: total }, (_, i) => {
    const sessionNum = i + 1;
    const isCompleted = sessionNum <= used;
    return {
      number: sessionNum,
      title: `Session ${sessionNum} of ${total}`,
      duration: "50 min",
      status: isCompleted ? "Completed" : "Available to Book",
      isCompleted,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {}
      <section className="package-sessions-card">
        <div className="package-sessions-header">
          <h3>Your Session Quota Breakdown</h3>
          <span style={{ fontSize: "12.5px", color: "#6f8f9f" }}>
            {used} Completed · {total - used} Available
          </span>
        </div>

        <div className="quota-grid">
          {sessionSlots.map((slot) => (
            <div
              key={slot.number}
              className={`quota-item-card ${slot.isCompleted ? "completed" : "available"}`}
            >
              <div className="quota-left">
                <div className="session-number-badge">#{slot.number}</div>
                <div>
                  <strong>{slot.title}</strong>
                  <span>Clinical consultation · {slot.duration}</span>
                </div>
              </div>

              {slot.isCompleted ? (
                <span className="quota-status-pill done">Completed</span>
              ) : (
                <Link to="/client/sessions" style={{ textDecoration: "none" }}>
                  <span className="quota-status-pill ready">Book Slot</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="explore-packages-card">
        <div className="explore-packages-header">
          <h3>Explore or Renew Therapy Packages</h3>
          <p>
            Choose a continuous care package that best supports your mental wellness journey.
          </p>
        </div>

        <div className="explore-grid">
          {availablePackages.map((pkg) => {
            const isCurrent =
              packageProgress?.name &&
              pkg.name.toLowerCase().trim() === packageProgress.name.toLowerCase().trim();

            return (
              <div
                key={pkg._id}
                className={`explore-plan-card ${isCurrent ? "current" : ""}`}
              >
                {isCurrent && <div className="current-tag">Your Plan</div>}

                <h4>{pkg.name}</h4>
                <div className="explore-plan-price">
                  ₹{pkg.price.toLocaleString()}
                  <span> / {pkg.sessions} sessions ({pkg.duration})</span>
                </div>

                <p className="explore-plan-desc">{pkg.description}</p>

                <ul className="explore-features-list">
                  {pkg.features && pkg.features.length > 0 ? (
                    pkg.features.map((f, idx) => <li key={idx}>{f}</li>)
                  ) : (
                    <>
                      <li>{pkg.sessions} Dedicated therapy sessions</li>
                      <li>Clinical intake and personalized roadmap</li>
                      <li>Priority booking with your assigned therapist</li>
                    </>
                  )}
                </ul>

                <button
                  type="button"
                  className={`plan-select-btn ${isCurrent ? "outline" : "primary"}`}
                  onClick={() => onPackageSelected && onPackageSelected(pkg)}
                >
                  {isCurrent ? "Renew This Plan" : `Upgrade to ${pkg.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default PackageSessions;
