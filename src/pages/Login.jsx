import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaGoogle,
  FaTwitter,
  FaEye,
  FaEyeSlash,
  FaGithub,
} from "react-icons/fa";
import vector from "../assets/vector.jpg";
import "../assets/Auth.css";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const showToast = (message, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const cleanupSwal = () => {
    Swal.close();
    Swal.hideLoading?.();

    document.querySelectorAll(".swal2-container").forEach((el) => el.remove());
    document.body.style.overflow = "auto";
    document.body.style.pointerEvents = "auto";
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 5)
      newErrors.password = "Password must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors above", "error");
      return;
    }

    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      const token =
        response?.token ||
        response?.accessToken ||
        response?.jwt ||
        response?.data?.token;

      if (token) localStorage.setItem("token", token);

      cleanupSwal();

      showToast("Logged in successfully", "success");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      cleanupSwal();
      showToast("Invalid email or password", "error");
    }
  };

  return (
    <div className="auth-container">
      {/* Image section */}
      <div className="auth-image">
        <img src={vector} alt="login vector" />
      </div>

      {/* Form section */}
      <div className="auth-form">
        <h3 className="mb-4">Login</h3>

        <div className="social-icons">
          <div className="social-btn"><FaGoogle /></div>
          <div className="social-btn"><FaTwitter /></div>
          <div className="social-btn"><FaGithub /></div>
        </div>

        <p>or use your email</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}

          <div
            className={`password-wrapper mb-1 ${
              errors.password ? "is-invalid" : ""
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}

          <div className="remember-row">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember Me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;