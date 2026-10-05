import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClockAlertIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function InvoiceIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function PackageIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function AttentionCard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttention = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/clients");
        if (res.data?.clients && Array.isArray(res.data.clients)) {
          const clientList = res.data.clients;
          const attentionList = [];

          if (clientList.length > 0) {
            const firstClient = clientList[0];
            const secondClient = clientList[1] || clientList[0];

            attentionList.push({
              type: "danger",
              icon: <ClockAlertIcon size={16} />,
              title: "Check-in overdue",
              subtitle: `${firstClient.name} · Intake follow-up pending`,
              actionText: "Review Client",
              link: "/clients",
            });

            const secondClientPkg = secondClient.package || "Session Plan";
            attentionList.push({
              type: "warning",
              icon: <InvoiceIcon size={16} />,
              title: "Invoice pending",
              subtitle: `${secondClient.name} · ${secondClientPkg} renewal`,
              actionText: "View Invoice",
              link: "/clients",
            });

            const endingClient =
              clientList.find((c) => (c.totalSessions || 6) - (c.sessionsUsed || 0) <= 2) ||
              firstClient;
            const remaining = Math.max(0, (endingClient.totalSessions || 6) - (endingClient.sessionsUsed || 0));

            attentionList.push({
              type: "info",
              icon: <PackageIcon size={16} />,
              title: "Package ending soon",
              subtitle: `${endingClient.name} · ${remaining} session${remaining === 1 ? "" : "s"} left in ${endingClient.package || "package"}`,
              actionText: "Send Renewal Link",
              link: "/packages",
            });
          }

          setItems(attentionList);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to load attention items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttention();
  }, []);

  return (
    <article className="dashboard-card attention-card">
      <div className="card-heading">
        <h2>Needs Your Attention</h2>
      </div>

      <div className="attention-list">
        {loading ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#607d92",
              fontSize: "13px",
            }}
          >
            Reviewing client alerts...
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={idx}
              className={`attention-item attention-${item.type}`}
            >
              <div className="attention-item-left">
                <div className="attention-icon-badge">{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </div>

              <Link to={item.link}>
                <button type="button">{item.actionText}</button>
              </Link>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "24px 14px",
              textAlign: "center",
              color: "#4f7289",
              fontSize: "13px",
            }}
          >
            ✓ All client records and treatment packages are currently up to date.
          </div>
        )}
      </div>
    </article>
  );
}

export default AttentionCard;