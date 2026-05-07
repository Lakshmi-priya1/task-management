import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import {
  EmailOutlined,
  ArrowForwardRounded,
  ArrowBackRounded,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import vector from "../assets/vector.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const showToast = (
    message,
    type = "success"
  ) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2200,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({
        email: "Email is required",
      });

      showToast(
        "Please enter email",
        "error"
      );
      return;
    }

    if (
      !/\S+@\S+\.\S+/.test(email)
    ) {
      setErrors({
        email: "Enter valid email",
      });

      showToast(
        "Invalid email address",
        "error"
      );
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast(
        "Reset link sent successfully"
      );
      setEmail("");
    }, 1500);
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
        {/* CIRCLES */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,.08)",
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
            background:
              "rgba(255,255,255,.08)",
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 430,
            zIndex: 2,
          }}
        >
          {/* HEADING */}
          <Typography
            sx={{
              color: "#fff",
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Forgot Password
          </Typography>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,.85)",
              mb: 4,
            }}
          >
            Enter your registered
            email address and we’ll
            send you a reset link.
          </Typography>

          {/* CARD */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "28px",
              background:
                "rgba(255,255,255,.97)",
              boxShadow:
                "0 25px 60px rgba(0,0,0,.15)",
            }}
          >
            <form
              onSubmit={handleSubmit}
            >
              {/* EMAIL */}
              <TextField
                fullWidth
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                error={
                  !!errors.email
                }
                helperText={
                  errors.email
                }
                size="small"
                sx={{
                  mb: 3,
                  ...inputSx,
                }}
                slotProps={{
                  input: {
                    startAdornment:
                      (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{
                              color:
                                "#7c3aed",
                            }}
                          />
                        </InputAdornment>
                      ),
                  },
                }}
              />

              {/* BUTTON */}
              <Button
                fullWidth
                type="submit"
                disabled={
                  loading
                }
                endIcon={
                  !loading && (
                    <ArrowForwardRounded />
                  )
                }
                sx={{
                  height: 50,
                  borderRadius:
                    "14px",
                  color: "#fff",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{
                      color:
                        "#fff",
                    }}
                  />
                ) : (
                  "SEND RESET LINK"
                )}
              </Button>

              {/* BACK */}
              <Button
                component={Link}
                to="/"
                fullWidth
                startIcon={
                  <ArrowBackRounded />
                }
                sx={{
                  mt: 2,
                  height: 48,
                  borderRadius:
                    "14px",
                  fontWeight: 700,
                  color:
                    "#6d28d9",
                  background:
                    "#f5f3ff",

                  "&:hover": {
                    background:
                      "#ede9fe",
                  },
                }}
              >
                Back to Login
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;