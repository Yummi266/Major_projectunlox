import { Link } from "react-router-dom";
import { MessageSquareIcon } from "../common/Icons";

function TherapistMessage({ message }) {
  const text =
    message?.text ||
    "Remember to practice your grounding reflection before our next consultation. You made noticeable progress during our session.";
  const senderName = message?.senderName || "Your Therapist";
  const specialization = message?.specialization || "Relationship Counseling & CBT";

  return (
    <article className="dashboard-card therapist-message-card">
      <div className="card-heading">
        <h2>Therapist Guidance</h2>
        <span className="message-badge">Latest Note</span>
      </div>

      <div className="message-card-body">
        <div className="message-bubble">
          <p className="message-text">"{text}"</p>

          <div className="message-author">
            <span className="author-dot"></span>
            <span>{senderName} · {specialization}</span>
          </div>
        </div>

        <div className="message-actions">
          <Link to="/client/messages" style={{ textDecoration: "none" }}>
            <button type="button" className="client-action-btn primary">
              <MessageSquareIcon size={14} />
              <span>Reply to {senderName}</span>
            </button>
          </Link>
          <Link to="/client/sessions" style={{ textDecoration: "none" }}>
            <button type="button" className="client-action-btn secondary">
              View Sessions
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TherapistMessage;
