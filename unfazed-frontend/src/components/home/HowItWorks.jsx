import { QuestionnaireIcon, MatchConsultIcon, VideoSessionIcon } from "../common/Icons";

function HowItWorks() {
  return (
    <section
      className="how-section"
      id="how-it-works"
    >

      <h2>
        Getting Started is gentle
      </h2>

      <div className="steps-grid">

        <article className="step-card">

          <div className="step-header">
            <span className="step-number">
              1.
            </span>
            <QuestionnaireIcon size={20} className="step-icon" />
          </div>

          <h3>
            Tell us how you feel
          </h3>

          <p>
            A short, private questionnaire.
          </p>

        </article>

        <article className="step-card">

          <div className="step-header">
            <span className="step-number">
              2.
            </span>
            <MatchConsultIcon size={20} className="step-icon" />
          </div>

          <h3>
            Discuss freely
          </h3>

          <p>
            We suggest therapists who fit you.
          </p>

        </article>

        <article className="step-card">

          <div className="step-header">
            <span className="step-number">
              3.
            </span>
            <VideoSessionIcon size={20} className="step-icon" />
          </div>

          <h3>
            Start your sessions
          </h3>

          <p>
            Video, voice, or chat, your choice.
          </p>

        </article>

      </div>

    </section>
  );
}

export default HowItWorks;