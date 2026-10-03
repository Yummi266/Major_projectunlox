import { useState, useEffect } from "react";
import axios from "axios";
import { authService } from "../../services/authService";

function BookSessionModal({
  isOpen,
  onClose,
  onBooked,
  therapistName,
  therapistSpecialization,
  currentTherapistId
}) {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState(currentTherapistId || "");
  const [loadingTherapists, setLoadingTherapists] = useState(false);

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("06:00 PM");
  const [type, setType] = useState("Video");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch all available therapists so the user can choose who to take
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchTherapists = async () => {
      setLoadingTherapists(true);
      try {
        const res = await axios.get("http://localhost:5000/api/therapists");
        if (isMounted && res.data?.therapists && Array.isArray(res.data.therapists)) {
          setTherapists(res.data.therapists);

          // If current selection is empty or not in list, pick currentTherapistId or the first therapist
          if (res.data.therapists.length > 0) {
            const hasCurrent = res.data.therapists.some((t) => t._id === currentTherapistId);
            if (hasCurrent) {
              setSelectedTherapistId(currentTherapistId);
            } else if (!selectedTherapistId) {
              setSelectedTherapistId(res.data.therapists[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load therapists:", err);
      } finally {
        if (isMounted) setLoadingTherapists(false);
      }
    };

    fetchTherapists();

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentTherapistId]);

  if (!isOpen) return null;

  // Find currently selected therapist object for rich preview
  const activeTherapist = therapists.find((t) => t._id === selectedTherapistId) || {
    name: therapistName || "Assigned Therapist",
    specialization: therapistSpecialization || "Clinical Care",
    _id: currentTherapistId
  };

  const activeName = activeTherapist.name?.startsWith("Dr.")
    ? activeTherapist.name
    : `Dr. ${activeTherapist.name || "Therapist"}`;

  const initials = activeName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TH";

  const isAssigned = currentTherapistId && selectedTherapistId === currentTherapistId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date for your session.");
      return;
    }
    if (!selectedTherapistId && therapists.length > 0) {
      setError("Please choose a therapist for your session.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Calculate end time (50 min later)
      const endTimeMap = {
        "10:00 AM": "10:50 AM",
        "11:00 AM": "11:50 AM",
        "02:00 PM": "02:50 PM",
        "04:00 PM": "04:50 PM",
        "06:00 PM": "06:50 PM"
      };

      await axios.post(
        "http://localhost:5000/api/appointments/client-book",
        {
          therapistId: selectedTherapistId,
          date,
          startTime: time,
          endTime: endTimeMap[time] || "06:50 PM",
          type,
          topic: topic.trim() || "Clinical Consultation & Check-in"
        },
        { headers }
      );

      onBooked();
      onClose();
    } catch (err) {
      console.error("Failed to book session:", err);
      setError(err.response?.data?.message || "Failed to book session. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-modal-header">
          <h3>Book a Therapy Session</h3>
          <button className="book-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="book-modal-body">
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#b91c1c",
                  fontSize: "12.5px",
                  marginBottom: "16px"
                }}
              >
                {error}
              </div>
            )}

            {/* Choose Therapist */}
            <div className="book-form-group">
              <label htmlFor="therapist-select">Choose Therapist *</label>
              {loadingTherapists ? (
                <div style={{ fontSize: "12.5px", color: "#607f96", padding: "8px 0" }}>
                  Loading care providers...
                </div>
              ) : therapists.length > 0 ? (
                <select
                  id="therapist-select"
                  value={selectedTherapistId}
                  onChange={(e) => setSelectedTherapistId(e.target.value)}
                  required
                >
                  {therapists.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name.startsWith("Dr.") ? t.name : `Dr. ${t.name}`} — {t.specialization}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={`${therapistName || "Assigned Therapist"} (${therapistSpecialization || "Clinical Care"})`}
                  style={{ background: "#f8fbfd", color: "#607f96" }}
                />
              )}

              {/* Therapist Quick Info Card */}
              {activeTherapist && (
                <div className="therapist-preview-card">
                  <div className="therapist-preview-left">
                    <div className="therapist-preview-avatar">{initials}</div>
                    <div className="therapist-preview-info">
                      <strong>{activeName}</strong>
                      <span>{activeTherapist.specialization || "Clinical Care"}</span>
                    </div>
                  </div>

                  <span
                    className={`therapist-preview-badge ${
                      isAssigned ? "assigned" : "selected"
                    }`}
                  >
                    {isAssigned ? "✓ Assigned" : "Selected"}
                  </span>
                </div>
              )}
            </div>

            <div className="book-form-group">
              <label>Session Focus / Topic</label>
              <input
                type="text"
                placeholder="e.g., Relational communication & boundaries"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="book-form-group">
              <label>Session Date *</label>
              <input
                type="date"
                min={minDateStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="book-form-group">
              <label>Time Slot *</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="10:00 AM">10:00 AM – 10:50 AM</option>
                <option value="11:00 AM">11:00 AM – 11:50 AM</option>
                <option value="02:00 PM">02:00 PM – 02:50 PM</option>
                <option value="04:00 PM">04:00 PM – 04:50 PM</option>
                <option value="06:00 PM">06:00 PM – 06:50 PM</option>
              </select>
            </div>

            <div className="book-form-group">
              <label>Session Modality</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Video">Video Session</option>
                <option value="Chat">Chat Session</option>
                <option value="In-Person">In-Person Consultation</option>
              </select>
            </div>
          </div>

          <div className="book-modal-footer">
            <button
              type="button"
              className="details-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="join-btn"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookSessionModal;
