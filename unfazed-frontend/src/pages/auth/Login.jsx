import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "../../components/common/Icons";

function Login() {
  const [role, setRole] = useState("therapist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "true") {
      setInfoMessage("Your session expired. Please sign in to continue.");
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);

    try {
      const data = await authService.login(email, password, role);

      const returnUrl = location.state?.from?.pathname;
      if (returnUrl) {
        navigate(returnUrl);
        return;
      }

      if (data.user?.role === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and make sure the server is running.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={role}
      setRole={(newRole) => {
        setRole(newRole);
        setErrorMessage("");
      }}
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
        {infoMessage && (
          <div
            style={{
              padding: "10px 14px",
              marginBottom: "16px",
              borderRadius: "8px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              fontSize: "0.875rem",
              lineHeight: "1.4"
            }}
          >
            {infoMessage}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: "10px 14px",
              marginBottom: "16px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "0.875rem",
              lineHeight: "1.4"
            }}
          >
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email address</label>

          <div className="input-wrapper">
            <span className="input-icon">
              <MailIcon size={16} />
            </span>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "therapist" ? "name@practice.com" : "name@example.com"}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={16} />
            </span>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
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

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign in securely"}
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
