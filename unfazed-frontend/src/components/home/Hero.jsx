import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-content">

        <div className="hero-badge">
          Private, licensed, online care
        </div>

        <h1>
          You don't have to
          <br />
          carry it alone.
        </h1>

        <p>
          Talk with a caring, licensed therapist from home,
          on your schedule, with your privacy protected.
        </p>

        <div className="hero-buttons">

          <Link
            to="/register"
            className="hero-primary"
          >
            Book a free intro call
          </Link>

          <a
            href="#therapists"
            className="hero-secondary"
          >
            Meet our therapists
          </a>

        </div>

      </div>

      <div className="hero-image-wrapper">

        <div className="hero-image-card">

          <img
            src="/images/Hero-therapy.png"
            alt="Therapist talking with a client"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;