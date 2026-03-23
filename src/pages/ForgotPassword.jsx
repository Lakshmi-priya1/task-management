import { useState } from "react";
import ToastMessage from "../components/ToastMessage";
import { Link } from "react-router-dom";
import "../assets/Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "Email is required" });
      showToast("Please enter your email", "error");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email" });
      showToast("Invalid email", "error");
    } else {
      setErrors({});
      showToast("Password reset link sent to your email");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h3 className="mb-3">Forgot Password</h3>
        <p >
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className={`form-control mb-3 ${errors.email ? "is-invalid" : ""}`}
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>

        <p className="mt-3">
          <Link to="/">Back to Login</Link>
        </p>
      </div>

      {toastMessage && (
        <ToastMessage
          id="forgotToast"
          message={toastMessage.message}
          type={toastMessage.type}
        />
      )}
    </div>
  );
}

export default ForgotPassword;