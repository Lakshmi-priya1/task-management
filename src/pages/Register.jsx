import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ToastMessage from "../components/ToastMessage";
import { FaFacebookF, FaGoogle, FaTwitter, FaInstagram } from "react-icons/fa";
import vector from "../assets/vector.jpg";
import "../assets/Register.css";
import { registerUser } from "../services/authService"; // ✅ IMPORT ADDED

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: "",
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "",
    departmentId: "",
    phone: "",
    designation: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!form.username) newErrors.username = "Username is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter valid email";

    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 8)
      newErrors.password = "Min 8 characters required";

    if (!form.firstName) newErrors.firstName = "First name required";

    if (!form.phone) newErrors.phone = "Phone required";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit phone";

    if (!form.status) newErrors.status = "Select status";

    return newErrors;
  };

  // ✅ Submit (CONNECTED TO BACKEND)
  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please fix errors", "error");
      return;
    }

    try {
      const response = await registerUser(form);

      console.log("Register Success:", response);

      showToast("Registration successful 🎉");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Register Error:", error);
      showToast("Registration failed ❌", "error");
    }
  };

  return (
    <div className="register-container">
      {/* LEFT IMAGE */}
      <div className="register-image">
        <img src={vector} alt="register" />
      </div>

      {/* RIGHT FORM */}
      <div className="register-form">
        <h3 className="mb-3">Create Account</h3>

        {/* Social Icons */}
        <div className="social-icons mb-3">
          <div className="social-btn">
            <FaFacebookF />
          </div>
          <div className="social-btn">
            <FaGoogle />
          </div>
          <div className="social-btn">
            <FaTwitter />
          </div>
          <div className="social-btn">
            <FaInstagram />
          </div>
        </div>

        <p className="text-muted mb-3">or register with your details</p>

        <div className="form-box">
          <form onSubmit={handleRegister}>
            <div className="register-grid">
              <input
                name="employeeId"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={handleChange}
              />

              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className={errors.username ? "is-invalid" : ""}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}

              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className={errors.firstName ? "is-invalid" : ""}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}

              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "is-invalid" : ""}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "is-invalid" : ""}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "is-invalid" : ""}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}

              <input
                name="designation"
                placeholder="Designation"
                value={form.designation}
                onChange={handleChange}
              />

              <input
                name="roleId"
                placeholder="Role ID"
                value={form.roleId}
                onChange={handleChange}
              />

              <input
                name="departmentId"
                placeholder="Department ID"
                value={form.departmentId}
                onChange={handleChange}
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`full-width ${errors.status ? "is-invalid" : ""}`}
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </div>

            <button type="submit" className="register-btn full-width">
              Register
            </button>
          </form>

          <p className="mt-3">
            Already have an account?
            <Link to="/" className="text-decoration-none">
              {" "}
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* TOAST */}
      {toastMessage && (
        <ToastMessage
          id="registerToast"
          message={toastMessage.message}
          type={toastMessage.type}
        />
      )}
    </div>
  );
}

export default Register;
