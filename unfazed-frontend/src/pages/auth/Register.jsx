import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import {
  UserIcon,
  MailIcon,
  BriefcaseIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon
} from "../../components/common/Icons";

function Register() {
  const [role, setRole] = useState("therapist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (role === "therapist") {
        await authService.registerTherapist({
          name,
          email,
          password,
          specialization: specialization || "Clinical Psychology"
        });
        navigate("/dashboard");
      } else {
        await authService.registerClient({
          name,
          email,
          password
        });
        navigate("/client/dashboard");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Registration failed. Please make sure the backend server is running and try again.";
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
          ? "Create your practice"
          : "Begin your journey"
      }
      description={
        role === "therapist"
          ? "Set up your secure workspace and start managing your practice."
          : "Create your secure account and take the first step toward support."
      }
    >
      <form className="auth-form register-form" onSubmit={handleSubmit}>
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
          <label htmlFor="name">
            {role === "therapist" ? "Full name" : "Your name"}
          </label>

          <div className="input-wrapper">
            <span className="input-icon">
              <UserIcon size={16} />
            </span>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                role === "therapist" ? "Dr. Your Name" : "Your full name"
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email address</label>

          <div className="input-wrapper">
            <span className="input-icon">
              <MailIcon size={16} />
            </span>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        {role === "therapist" && (
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>

            <div className="input-wrapper">
              <span className="input-icon">
                <BriefcaseIcon size={16} />
              </span>

              <input
                id="specialization"
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Clinical Psychologist"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="register-password">Password</label>

          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={16} />
            </span>

            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
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

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm password</label>

          <div className="input-wrapper">
            <span className="input-icon">
              <LockIcon size={16} />
            </span>

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={16} />
              ) : (
                <EyeIcon size={16} />
              )}
            </button>
          </div>
        </div>

        <label className="terms-checkbox">
          <input type="checkbox" required />
          <span>
            I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </span>
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="auth-help">
          <span>Already have an account?</span>
          <Link to="/login">Sign in securely</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;