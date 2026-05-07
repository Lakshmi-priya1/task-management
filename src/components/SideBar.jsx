// FILE: Sidebar.jsx

import { NavLink } from "react-router-dom";
import {
  Box,
  Typography,
  Tooltip,
} from "@mui/material";

import {
  DashboardRounded,
  GroupsRounded,
  TaskRounded,
  FolderRounded,
  FlagRounded,
  AssignmentRounded,
} from "@mui/icons-material";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardRounded />,
  },
  {
    label: "Employees",
    path: "/dashboard/employee",
    icon: <GroupsRounded />,
  },
  {
    label: "Projects",
    path: "/dashboard/project",
    icon:  <FolderRounded />,
  },
  {
    label: "Milestones",
    path: "/dashboard/milestone",
    icon: <FlagRounded />,
  },
  {
    label: "Tasks",
    path: "/dashboard/users",
    icon: <AssignmentRounded />,
  },
];

export default function Sidebar({ collapsed }) {
  return (
    <Box
      sx={{
        width: collapsed ? 80 : 260,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1300,
        transition: "0.3s ease",

        display: "flex",
        flexDirection: "column", // IMPORTANT

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: "rgba(255,255,255,0.58)",
        borderRight: "1px solid rgba(255,255,255,0.35)",
        boxShadow: "0 10px 40px rgba(91,33,182,0.08)",

        px: 2,
        py: 2,
      }}
    >
      {/* Top Content */}
      <Box>
        {/* Logo */}
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 0 : 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "14px",
              background:
                "linear-gradient(135deg,#7c3aed,#8b5cf6,#a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              mr: collapsed ? 0 : 1.5,
              boxShadow: "0 12px 25px rgba(124,58,237,.25)",
            }}
          >
            T
          </Box>

          {!collapsed && (
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#312e81",
                }}
              >
                Taskify
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#7c3aed",
                  fontWeight: 600,
                }}
              >
                Productivity Suite
              </Typography>
            </Box>
          )}
        </Box>

        {/* Section */}
        {!collapsed && (
          <Typography
            sx={{
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 700,
              px: 1,
              mb: 1,
              mt: 2,
              letterSpacing: 1,
            }}
          >
            MAIN MENU
          </Typography>
        )}

        {/* Menu */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Tooltip
                  title={collapsed ? item.label : ""}
                  placement="right"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: collapsed ? 0 : 2,
                      justifyContent: collapsed
                        ? "center"
                        : "flex-start",
                      height: 50,
                      borderRadius: "16px",
                      transition: "0.25s ease",
                      cursor: "pointer",

                      background: isActive
                        ? "linear-gradient(135deg,#8b5cf6,#a855f7)"
                        : "transparent",

                      color: isActive ? "#fff" : "#4b5563",

                      boxShadow: isActive
                        ? "0 12px 22px rgba(139,92,246,.22)"
                        : "none",

                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(135deg,#8b5cf6,#a855f7)"
                          : "rgba(139,92,246,.08)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {item.icon}

                    {!collapsed && (
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {item.label}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              )}
            </NavLink>
          ))}
        </Box>
      </Box>

      {/* Bottom Card */}
      {!collapsed && (
        <Box
          sx={{
            mt: "auto", // PUSHES TO BOTTOM
            p: 2,
            borderRadius: "20px",
            background:
              "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            color: "#fff",
            boxShadow: "0 15px 30px rgba(124,58,237,.18)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 14,
              mb: 0.5,
            }}
          >
            Need Focus?
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              opacity: 0.85,
            }}
          >
            Finish tasks faster today 🚀
          </Typography>
        </Box>
      )}
    </Box>
  );
}