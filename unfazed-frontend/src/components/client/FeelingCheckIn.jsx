import { useState } from "react";

function FeelingCheckIn() {
  const [selectedFeeling, setSelectedFeeling] = useState("Good");

  const feelings = [
    {
      name: "Low",
      className: "feeling-low"
    },
    {
      name: "Okay",
      className: "feeling-okay"
    },
    {
      name: "Good",
      className: "feeling-good"
    },
    {
      name: "Great",
      className: "feeling-great"
    },
    {
      name: "Anxious",
      className: "feeling-anxious"
    }
  ];

  return (
    <div className="feeling-card">

      <h2>How are you feeling today?</h2>

      <div className="feeling-options">

        {feelings.map((feeling) => (
          <button
            key={feeling.name}
            className={`feeling-option ${feeling.className} ${selectedFeeling === feeling.name ? "selected" : ""
              }`}
            onClick={() => setSelectedFeeling(feeling.name)}
          >
            <span className="feeling-icon">□</span>
            <span>{feeling.name}</span>
          </button>
        ))}

      </div>

      <button className="save-checkin">
        Save check-in
      </button>

    </div>
  );
}

export default FeelingCheckIn;