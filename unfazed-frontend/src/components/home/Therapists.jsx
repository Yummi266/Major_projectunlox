function Therapists() {
  const therapists = [
    {
      name: "Dr. Ethan Carter",
      specialty: "Anxiety, stress, burnout",
      image: "/images/FirstDoc.png"
    },
    {
      name: "Dr. Maya Wilson",
      specialty: "Depression, grief",
      image: "/images/SecondDoc.png"
    },
    {
      name: "Dr. Daniel Brooks",
      specialty: "Relationships, family",
      image: "/images/Thirddoc.png"
    }
  ];

  return (
    <section
      className="therapists-section"
      id="therapists"
    >

      <h2>
        People who will listen
      </h2>

      <div className="therapist-grid">

        {therapists.map((therapist) => (

          <article
            className="therapist-card"
            key={therapist.name}
          >

            <img
              src={therapist.image}
              alt={therapist.name}
            />

            <h3>
              {therapist.name}
            </h3>

            <p>
              {therapist.specialty}
            </p>

          </article>

        ))}

      </div>

    </section>
  );
}

export default Therapists;