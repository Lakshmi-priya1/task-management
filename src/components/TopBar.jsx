import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  Box, IconButton, Typography, Avatar,
  Menu, MenuItem, Divider, Tooltip,
} from "@mui/material";
import {
  MenuRounded, NotificationsNoneRounded, KeyboardArrowDownRounded,
  LockOutlined, LogoutOutlined, FullscreenRounded, FullscreenExitRounded,
  DarkModeRounded, LightModeRounded,
} from "@mui/icons-material";
import { ColorModeContext } from "../App";
import { logout } from "../store/slices/authSlice";

// Role → base path (matches App.jsx)
const ROLE_BASE = {
  ADMIN:           "/admin",
  PROJECT_MANAGER: "/pm",
  TEAM_LEAD:       "/lead",
  EMPLOYEE:        "/employee",
};

export default function Topbar({ toggleSidebar }) {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  // Read directly from Redux — no need to decode JWT again
  const { email, role } = useSelector((state) => state.auth);

  const profileName = email
    ? email.split("@")[0].replace(/^./, c => c.toUpperCase())
    : "User";

  const base = ROLE_BASE[role] ?? "";

  const [anchorEl, setAnchorEl]       = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await Swal.fire({
      toast: true, position: "top-end",
      icon: "success", title: "Logged out successfully!",
      showConfirmButton: false, timer: 2200, timerProgressBar: true,
      didOpen: (toast) => {
        const container = toast.closest(".swal2-container");
        container.style.zIndex = "1201";
        container.style.top = "68px";
      },
    });
    dispatch(logout()); // clears Redux + localStorage
    navigate("/");
  };

  const isDark = mode === "dark";

  const iconBtnSx = {
    width: 40, height: 40, borderRadius: "12px",
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
    color: isDark ? "#c4b5fd" : "#7c3aed",
    "&:hover": { background: isDark ? "rgba(255,255,255,0.15)" : "rgba(139,92,246,0.15)" },
  };

  return (
    <Box sx={{
      height: 68, px: 3,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 1200,
      backdropFilter: "blur(14px)",
      background: isDark ? "rgba(15,15,30,0.75)" : "rgba(255,255,255,0.45)",
      borderBottom: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(255,255,255,0.35)",
    }}>
      {/* LEFT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Tooltip title="Toggle Sidebar">
          <IconButton onClick={toggleSidebar} sx={iconBtnSx}>
            <MenuRounded />
          </IconButton>
        </Tooltip>
        <Typography sx={{ fontWeight: 800, fontSize: 17, color: isDark ? "#e0e7ff" : "#312e81" }}>
          Taskify
        </Typography>
      </Box>

      {/* RIGHT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={toggleFullscreen} sx={iconBtnSx}>
            {isFullscreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
          <IconButton onClick={toggleColorMode} sx={iconBtnSx}>
            {isDark ? <LightModeRounded /> : <DarkModeRounded />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton sx={iconBtnSx}>
            <NotificationsNoneRounded />
          </IconButton>
        </Tooltip>

        {/* Profile chip */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            px: 1.5, py: 0.5, borderRadius: "999px", cursor: "pointer",
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)",
            "&:hover": { background: isDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.9)" },
          }}
        >
          <Avatar sx={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#8b5cf6,#a855f7)",
            fontSize: 14, fontWeight: 700,
          }}>
            {profileName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: isDark ? "#e0e7ff" : "#111827", lineHeight: 1.2 }}>
              {profileName}
            </Typography>
            <Typography sx={{ fontSize: 10, color: isDark ? "#a78bfa" : "#6b7280", lineHeight: 1 }}>
              {role?.replace("_", " ")}
            </Typography>
          </Box>
          <KeyboardArrowDownRounded sx={{ fontSize: 18, color: isDark ? "#a78bfa" : "#6b7280" }} />
        </Box>

        {/* Dropdown menu */}
        <Menu
          anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { mt: 1.5, borderRadius: "16px", minWidth: 200, boxShadow: "0 18px 35px rgba(0,0,0,.12)" } }}
        >
          <MenuItem onClick={() => { setAnchorEl(null); navigate(`${base}/change-password`); }}>
            <LockOutlined sx={{ mr: 1.5, fontSize: 18, color: "#6366f1" }} />
            Change Password
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
            <LogoutOutlined sx={{ mr: 1.5, fontSize: 18 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}