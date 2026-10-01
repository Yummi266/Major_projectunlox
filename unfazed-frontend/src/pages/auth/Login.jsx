import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

function Login() {
  const [role, setRole] = useState("therapist");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login:", {
      role,
      rememberMe,
    });
  };

  return (
    <AuthLayout
      role={role}
      setRole={setRole}
      title={
        role === "therapist"
          ? "Sign in to your workspace"
          : "Sign in to your Journey to healing"
      }
      description={
        role === "therapist"
          ? "Continue securely to your schedule and clinical tools."
          : "Continue securely to your privacy and find right support."
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>

          <div className="input-wrapper">
            <span className="input-icon">✉</span>

            <input
              id="email"
              type="email"
              placeholder={role === "therapist" ? "name@practice.com" : "name@example.com"}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="input-wrapper">
            <span className="input-icon">♙</span>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "◉" : "◌"}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />

            <span>Remember me</span>
          </label>

          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="primary-button">
          Sign in securely
        </button>

        <div className="auth-help">
          <span>Don't have an account?</span>

          <Link to="/register">Create an account</Link>

          <a href="mailto:support@unfazed.in">Contact practice support</a>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
