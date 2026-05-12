// hooks/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { loginThunk } from "../store/slices/authSlice";

const showToast = (msg, type = "success") =>
  Swal.fire({
    toast: true, position: "top-end",
    icon: type, title: msg,
    showConfirmButton: false, timer: 2200,
  });

export function useLogin() {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm]             = useState({ email: "", password: "", remember: false });
  const [errors, setErrors]         = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const err = {};
    if (!form.email)    err.email    = "Email is required";
    if (!form.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(result)) {
      showToast("Welcome back!");
      navigate("/dashboard");
    } else {
      showToast(result.payload || "Invalid email or password", "error");
    }
  };

  const togglePassword = () => setShowPassword((p) => !p);

  return { form, errors, loading, showPassword, togglePassword, handleChange, handleLogin };
}