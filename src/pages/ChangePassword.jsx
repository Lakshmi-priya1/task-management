import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  ArrowBackRounded,
  LockOutlined,
} from "@mui/icons-material";

import Swal from "sweetalert2";

function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const showToast = (
    msg,
    type = "success"
  ) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: msg,
      showConfirmButton: false,
      timer: 2200,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.oldPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      showToast(
        "Fill all fields",
        "error"
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      showToast(
        "Passwords do not match",
        "error"
      );
      return;
    }

    showToast(
      "Password updated successfully"
    );

    setForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const fieldStyle = {
    mb: 1.7,
    "& .MuiOutlinedInput-root":
      {
        height: 48,
        borderRadius: "14px",
        background:
          "#f9fafb",
      },
  };

  return (
    <Box
      sx={{
        height:
          "calc(100vh - 78px)", // topbar height removed
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3,
          borderRadius: "26px",
          background:
            "rgba(255,255,255,0.92)",
          border:
            "1px solid rgba(255,255,255,0.7)",
          boxShadow:
            "0 18px 45px rgba(0,0,0,0.08)",
        }}
      >
        {/* BACK */}
        <IconButton
          onClick={() =>
            navigate(-1)
          }
          sx={{
            width: 40,
            height: 40,
            mb: 1,
            borderRadius: "12px",
            background:
              "rgba(99,102,241,0.10)",
            color: "#6366f1",
          }}
        >
          <ArrowBackRounded />
        </IconButton>

        {/* TITLE */}
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 800,
            color: "#111827",
            mb: 0.5,
          }}
        >
          Change Password
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#6b7280",
            mb: 2.2,
          }}
        >
          Update your account
          password securely.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={
              handleChange
            }
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      color:
                        "#8b5cf6",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={
              handleChange
            }
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      color:
                        "#8b5cf6",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              form.confirmPassword
            }
            onChange={
              handleChange
            }
            sx={{
              ...fieldStyle,
              mb: 2.2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      color:
                        "#8b5cf6",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            sx={{
              height: 48,
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "none",
              color: "#fff",
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              boxShadow:
                "0 15px 30px rgba(99,102,241,0.20)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#4f46e5,#7c3aed)",
              },
            }}
          >
            Update Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ChangePassword;