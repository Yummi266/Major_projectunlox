import { MessageSquareIcon, ShieldLockIcon } from "../common/Icons";

function ClientMessageContacts({ therapistName = "Your Therapist", specialization = "Relationship Counseling" }) {
  const initials = therapistName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TW";

  return (
    <div className="client-contacts-list">
      <div className="contact-item active">
        <div className="contact-avatar">{initials}</div>
        <div className="contact-info">
          <strong>{therapistName}</strong>
          <span>{specialization}</span>
        </div>
      </div>
    </div>
  );
}

export default ClientMessageContacts;
