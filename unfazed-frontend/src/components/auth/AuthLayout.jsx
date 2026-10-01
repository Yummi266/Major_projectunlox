import { Link } from "react-router-dom";

function AuthLayout({
  children,
  role,
  setRole,
  title,
  description
}) {
  const isTherapist = role === "therapist";

  return (
    <div className="auth-page">

      <section className="auth-left">

        <Link to="/" className="brand">
          <div className="brand-icon">U</div>
          <span>Unfazed</span>
        </Link>

        <div className="auth-left-wrapper">
          <div className="auth-left-content">
            <div className="wordcloud-container">
              <img
                src="/images/mental-health-wordcloud.jpg"
                alt="Mental health word cloud"
                className="wordcloud-image"
              />
            </div>

            <div className="left-content">
              <h1>
                {isTherapist
                  ? "Your care team starts here."
                  : "You are Doing Great JOB!"}
              </h1>

              <p>
                {isTherapist
                  ? "Access today’s schedule, client notes, and secure sessions in one focused clinical workspace."
                  : "Your privacy is our highest priority, backed by secure, state-of-the-art encryption."}
              </p>
            </div>
          </div>
        </div>

        <div className="emergency-text">
          Aster Care is not an emergency service. If you're in immediate
          danger, call local emergency services.
        </div>

      </section>

      <section className="auth-right">

        <div className="role-switch">

          <button
            type="button"
            className={role === "therapist" ? "active" : ""}
            onClick={() => setRole("therapist")}
          >
            Therapist
          </button>

          <button
            type="button"
            className={role === "client" ? "active" : ""}
            onClick={() => setRole("client")}
          >
            Client
          </button>

        </div>

        <main className="auth-card-wrapper">

          <div className="auth-card">

            <div className="auth-card-header">

              <span className="access-label">
                CLINICAL ACCESS
              </span>

              <h2>{title}</h2>

              <p>{description}</p>

            </div>

            {children}

          </div>

        </main>

        <div className="security-footer">
          <span>♙</span>
          Secure sign-in · Privacy protected · Session automatically times out
        </div>

      </section>

    </div>
  );
}

export default AuthLayout;