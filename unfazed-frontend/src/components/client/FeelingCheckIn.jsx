import { useState } from "react";

function FeelingCheckIn() {
  const [selectedFeeling, setSelectedFeeling] = useState("Good");
  const [saved, setSaved] = useState(false);

  const feelings = [
    { name: "Low", emoji: "😔" },
    { name: "Okay", emoji: "😐" },
    { name: "Good", emoji: "🙂" },
    { name: "Great", emoji: "😊" },
    { name: "Anxious", emoji: "😰" }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <article className="dashboard-card feeling-card">
      <div className="card-heading">
        <h2>Daily Mood & Check-In</h2>
        <span className="feeling-status-tag">
          {saved ? "Saved ✓" : "Today"}
        </span>
      </div>

      <div className="feeling-card-content">
        <p className="card-subtext">How are you feeling this evening?</p>

        <div className="feeling-chips-row">
          {feelings.map((feeling) => (
            <button
              key={feeling.name}
              type="button"
              className={`feeling-chip ${
                selectedFeeling === feeling.name ? "active" : ""
              }`}
              onClick={() => setSelectedFeeling(feeling.name)}
            >
              <span className="feeling-chip-emoji">{feeling.emoji}</span>
              <span className="feeling-chip-name">{feeling.name}</span>
            </button>
          ))}
        </div>

        <div className="feeling-note-wrap">
          <input
            type="text"
            className="feeling-note-input"
            placeholder="Add an optional reflection (e.g. calm after walk)..."
          />
          <button
            type="button"
            className="client-action-btn primary save-btn"
            onClick={handleSave}
          >
            {saved ? "Logged ✓" : "Save Check-In"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeelingCheckIn;