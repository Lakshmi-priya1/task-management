import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  ArrowForwardRounded,
} from "@mui/icons-material";

import { FaGoogle, FaGithub, FaLinkedinIn } from "react-icons/fa";

import Swal from "sweetalert2";
import vector from "../assets/vector.jpg";
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const err = {};

    if (!form.email) err.email = "Email is required";

    if (!form.password) err.password = "Password is required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const showToast = (msg, type = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: msg,
      showConfirmButton: false,
      timer: 2200,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await loginUser(form);

      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      showToast("Welcome back!");
      navigate("/dashboard");
    } catch {
      showToast("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "#f9fafb",

      "& fieldset": {
        borderColor: "#e5e7eb",
      },

      "&:hover fieldset": {
        borderColor: "#7c3aed",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#6d28d9",
      },
    },
  };

  const socialBtn = {
    width: 48,
    height: 48,
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 18px rgba(0,0,0,.08)",
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr",
        },
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          p: 4,
        }}
      >
        <Box
          component="img"
          src={vector}
          alt="vector"
          sx={{
            width: "100%",
            maxWidth: "700px",
            height: "90vh",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          background:
            "linear-gradient(160deg,#4f46e5 0%,#7c3aed 55%,#9333ea 100%)",
          overflow: "hidden",
        }}
      >
        {/* circles */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 430,
            zIndex: 2,
          }}
        >
          {/* Heading */}
          <Typography
            sx={{
              color: "#fff",
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.85)",
              mb: 4,
            }}
          >
            Login to manage employees, projects and productivity.
          </Typography>

          {/* CARD */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "28px",
              background: "rgba(255,255,255,.97)",
              boxShadow: "0 25px 60px rgba(0,0,0,.15)",
            }}
          >
            {/* SOCIAL LOGIN */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <IconButton
                sx={{
                  ...socialBtn,
                  color: "#ea4335",
                }}
              >
                <FaGoogle size={18} />
              </IconButton>

              <IconButton
                sx={{
                  ...socialBtn,
                  color: "#111827",
                }}
              >
                <FaGithub size={18} />
              </IconButton>

              <IconButton
                sx={{
                  ...socialBtn,
                  color: "#0a66c2",
                }}
              >
                <FaLinkedinIn size={18} />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }}>OR LOGIN WITH EMAIL</Divider>

            <form onSubmit={handleLogin}>
              {/* EMAIL */}

              <TextField
                fullWidth
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                size="small"
                sx={{
                  mb: 2,
                  ...inputSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: "#7c3aed" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* PASSWORD */}

              <TextField
                fullWidth
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                size="small"
                sx={{
                  mb: 1.5,
                  ...inputSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#7c3aed" }} />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <Visibility sx={{ color: "#7c3aed" }} />
                          ) : (
                            <VisibilityOff sx={{ color: "#9ca3af" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* REMEMBER */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.remember}
                      name="remember"
                      onChange={handleChange}
                      size="small"
                    />
                  }
                  label="Remember me"
                />

                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "#6d28d9",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* LOGIN BUTTON */}
              <Button
                fullWidth
                type="submit"
                disabled={loading}
                endIcon={!loading && <ArrowForwardRounded />}
                sx={{
                  height: 50,
                  borderRadius: "14px",
                  color: "#fff",
                  fontWeight: 800,
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
