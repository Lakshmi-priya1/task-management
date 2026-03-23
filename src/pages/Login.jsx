import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ToastMessage from "../components/ToastMessage";
import { FaGoogle, FaTwitter, FaEye, FaEyeSlash ,FaGithub} from "react-icons/fa";
import vector from "../assets/vector.jpg";
import "../assets/Auth.css";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // <-- new state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await loginUser({
        email: form.email,
        password: form.password
      });

      const token = response.token || response.accessToken || response.jwt || response.data?.token;

      if (token) localStorage.setItem("token", token);

      showToast("Logged in successfully");

      setTimeout(() => navigate("/dashboard"), 1000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Invalid email or password", "error");
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-image">
          <img src={vector} alt="login vector" />
        </div>

        <div className="auth-form">
          <h3 className="mb-4">Login</h3>

          <div className="social-icons">
           
            <div className="social-btn"><FaGoogle /></div>
            <div className="social-btn"><FaTwitter /></div>
            <div className="social-btn"><FaGithub /></div>
          </div>

          <p >or use your email</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-control mb-3"
              value={form.email}
              onChange={handleChange}
            />

            <div className="password-wrapper mb-3">
              <input
                type={showPassword ? "text" : "password"} // toggle type
                name="password"
                placeholder="Enter password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

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

            <button className="btn btn-primary w-100 mt-3">Login</button>
          </form>

          
        </div>
      </div>

      {toastMessage && (
        <ToastMessage
          id="loginToast"
          message={toastMessage.message}
          type={toastMessage.type}
        />
      )}
    </>
  );
}

export default Login;