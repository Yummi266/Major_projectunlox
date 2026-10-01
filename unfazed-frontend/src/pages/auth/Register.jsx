import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

function Register() {
  const [role, setRole] = useState("therapist");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Registration:", {
      role
    });
  };

  return (
    <AuthLayout
      role={role}
      setRole={setRole}
      title={
        role === "therapist"
          ? "Create your practice"
          : "Begin your journey"
      }
      description={
        role === "therapist"
          ? "Set up your secure workspace and start managing your practice."
          : "Create your secure account and take the first step toward support."
      }
    >

      <form
        className="auth-form register-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label htmlFor="name">
            {role === "therapist"
              ? "Full name"
              : "Your name"}
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ◯
            </span>

            <input
              id="name"
              type="text"
              placeholder={
                role === "therapist"
                  ? "Dr. Your Name"
                  : "Your full name"
              }
              required
            />

          </div>

        </div>

        <div className="form-group">

          <label htmlFor="register-email">
            Email address
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ✉
            </span>

            <input
              id="register-email"
              type="email"
              placeholder="name@example.com"
              required
            />

          </div>

        </div>

        {role === "therapist" && (
          <div className="form-group">

            <label htmlFor="specialization">
              Specialization
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                +
              </span>

              <input
                id="specialization"
                type="text"
                placeholder="Clinical Psychologist"
              />

            </div>

          </div>
        )}

        <div className="form-group">

          <label htmlFor="register-password">
            Password
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ♙
            </span>

            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "◉" : "◌"}
            </button>

          </div>

        </div>

        <div className="form-group">

          <label htmlFor="confirm-password">
            Confirm password
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ♙
            </span>

            <input
              id="confirm-password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? "◉" : "◌"}
            </button>

          </div>

        </div>

        <label className="terms-checkbox">

          <input
            type="checkbox"
            required
          />

          <span>
            I agree to the{" "}
            <Link to="/terms">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy">
              Privacy Policy
            </Link>
          </span>

        </label>

        <button
          type="submit"
          className="primary-button"
        >
          Create account
        </button>

        <div className="auth-help">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in securely
          </Link>

        </div>

      </form>

    </AuthLayout>
  );
}

export default Register;