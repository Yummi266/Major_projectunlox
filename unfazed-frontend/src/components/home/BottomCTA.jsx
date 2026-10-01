import { Link } from "react-router-dom";

function BottomCTA() {
  return (
    <section
      className="bottom-cta"
      id="support"
    >

      <h2>
        Ready when you are.
      </h2>

      <Link
        to="/register"
        className="cta-button"
      >
        Start Here
      </Link>

    </section>
  );
}

export default BottomCTA;