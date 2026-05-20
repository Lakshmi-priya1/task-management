import { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Tooltip, Collapse, useTheme } from "@mui/material";
import {
  DashboardRounded, GroupsRounded, FolderRounded,
  FlagRounded, AssignmentRounded, AccountTreeRounded,
  ChevronRightRounded, RocketLaunchRounded, WorkspacesRounded,
  TaskRounded, ManageAccountsRounded, BusinessRounded,
} from "@mui/icons-material";

const PURPLE      = "#7c3aed";
const PURPLE_SOFT = "rgba(124,58,237,0.08)";
const PURPLE_MID  = "rgba(124,58,237,0.15)";

// Role → base path prefix
const BASE = {
  ADMIN:           "/admin",
  PROJECT_MANAGER: "/pm",
  TEAM_LEAD:       "/lead",
  EMPLOYEE:        "/employee",
};

// Nav config per role
const NAV_CONFIG = {
  ADMIN: {
    top: [
      { label: "Dashboard",     path: "/admin/dashboard", icon: DashboardRounded,   end: true },
      { label: "Users",         path: "/admin/users",     icon: ManageAccountsRounded },
      { label: "Organizations", path: "/admin/organization", icon: BusinessRounded },
      { label: "Employees",     path: "/admin/employee",  icon: GroupsRounded },
    ],
    workspace: [
      { label: "Projects",   path: "/admin/project",   icon: FolderRounded },
      { label: "Milestones", path: "/admin/milestone", icon: FlagRounded },
      { label: "Tasks",      path: "/admin/task",      icon: TaskRounded },
    ],
    bottom: [
      { label: "Hierarchy", path: "/admin/hierarchy", icon: AccountTreeRounded },
    ],
  },
  PROJECT_MANAGER: {
    top: [
      { label: "Dashboard", path: "/pm/dashboard", icon: DashboardRounded, end: true },
      { label: "Employees", path: "/pm/employee",  icon: GroupsRounded },
    ],
    workspace: [
      { label: "Projects",   path: "/pm/project",   icon: FolderRounded },
      { label: "Milestones", path: "/pm/milestone", icon: FlagRounded },
      { label: "Tasks",      path: "/pm/task",      icon: TaskRounded },
    ],
    bottom: [
      { label: "Hierarchy", path: "/pm/hierarchy", icon: AccountTreeRounded },
    ],
  },
  TEAM_LEAD: {
    top: [
      { label: "Dashboard", path: "/lead/dashboard", icon: DashboardRounded, end: true },
    ],
    workspace: [
      { label: "Projects",   path: "/lead/project",   icon: FolderRounded },
      { label: "Milestones", path: "/lead/milestone", icon: FlagRounded },
      { label: "Tasks",      path: "/lead/task",      icon: TaskRounded },
    ],
    bottom: [
      { label: "Hierarchy", path: "/lead/hierarchy", icon: AccountTreeRounded },
    ],
  },
  EMPLOYEE: {
    top: [
      { label: "Dashboard", path: "/employee/dashboard", icon: DashboardRounded, end: true },
    ],
    workspace: [
      { label: "Projects", path: "/employee/project", icon: FolderRounded },
      { label: "Tasks",    path: "/employee/task",    icon: TaskRounded },
    ],
    bottom: [],
  },
};

/* ── Single nav row ── */
function Row({ item, collapsed, indent = false }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  const Icon   = item.icon;
  const dimText = isDark ? "#71717a" : "#64748b";
  const hoverBg = isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.03)";

  return (
    <NavLink to={item.path} end={item.end} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
          <Box sx={{
            position: "relative",
            display: "flex", alignItems: "center",
            height: indent ? 36 : 40,
            px: collapsed ? 0 : 1.25,
            pl: collapsed ? 0 : indent ? 3.5 : 1.25,
            gap: 1.25,
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "10px", cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            background: isActive ? (isDark ? PURPLE_MID : PURPLE_SOFT) : "transparent",
            color: isActive ? PURPLE : dimText,
            "&:hover": {
              background: isActive ? (isDark ? PURPLE_MID : PURPLE_SOFT) : hoverBg,
              color: isActive ? PURPLE : isDark ? "#e4e4e7" : "#1e293b",
            },
          }}>
            {isActive && !indent && (
              <Box sx={{
                position: "absolute", left: 0, top: "22%", bottom: "22%",
                width: 3, borderRadius: "0 3px 3px 0", background: PURPLE,
              }} />
            )}
            {isActive && indent && (
              <Box sx={{
                position: "absolute", left: 14, top: "50%",
                transform: "translateY(-50%)",
                width: 4, height: 4, borderRadius: "50%", background: PURPLE,
              }} />
            )}
            <Icon sx={{ fontSize: indent ? 16 : 18, flexShrink: 0 }} />
            {!collapsed && (
              <Typography sx={{
                fontSize: indent ? 12.5 : 13,
                fontWeight: isActive ? 700 : 450,
                letterSpacing: "0.01em", lineHeight: 1, color: "inherit",
              }}>
                {item.label}
              </Typography>
            )}
          </Box>
        </Tooltip>
      )}
    </NavLink>
  );
}

/* ── Workspace expandable group ── */
function WorkspaceGroup({ collapsed, items }) {
  const theme    = useTheme();
  const isDark   = theme.palette.mode === "dark";
  const location = useLocation();

  const anyActive = items.some(c => location.pathname.startsWith(c.path));
  const [open, setOpen] = useState(anyActive);

  const dimText = isDark ? "#71717a" : "#64748b";
  const hoverBg = isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.03)";

  if (!items.length) return null;

  return (
    <>
      <Tooltip title={collapsed ? "Workspace" : ""} placement="right" arrow>
        <Box
          onClick={() => !collapsed && setOpen(p => !p)}
          sx={{
            position: "relative", display: "flex", alignItems: "center",
            height: 40, px: collapsed ? 0 : 1.25, gap: 1.25,
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "10px", cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            background: anyActive ? (isDark ? PURPLE_MID : PURPLE_SOFT) : "transparent",
            color: anyActive ? PURPLE : dimText,
            "&:hover": {
              background: anyActive ? (isDark ? PURPLE_MID : PURPLE_SOFT) : hoverBg,
              color: anyActive ? PURPLE : isDark ? "#e4e4e7" : "#1e293b",
            },
          }}
        >
          {anyActive && (
            <Box sx={{
              position: "absolute", left: 0, top: "22%", bottom: "22%",
              width: 3, borderRadius: "0 3px 3px 0", background: PURPLE,
            }} />
          )}
          <WorkspacesRounded sx={{ fontSize: 18, flexShrink: 0 }} />
          {!collapsed && (
            <>
              <Typography sx={{
                fontSize: 13, fontWeight: anyActive ? 700 : 450,
                letterSpacing: "0.01em", flex: 1, color: "inherit",
              }}>
                Workspace
              </Typography>
              <ChevronRightRounded sx={{
                fontSize: 15, opacity: 0.5,
                transition: "transform 0.2s",
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                mr: 0.5,
              }} />
            </>
          )}
        </Box>
      </Tooltip>

      {!collapsed && (
        <Collapse in={open} timeout={180}>
          <Box sx={{
            ml: 2.5, mt: 0.25, mb: 0.25, pl: 1,
            borderLeft: `1.5px solid ${isDark ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.15)"}`,
            display: "flex", flexDirection: "column", gap: 0.25,
          }}>
            {items.map(child => (
              <Row key={child.path} item={child} collapsed={false} indent />
            ))}
          </Box>
        </Collapse>
      )}

      {collapsed && open && items.map(child => (
        <Row key={child.path} item={child} collapsed={true} indent />
      ))}
    </>
  );
}

function NavDivider() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{
      height: "1px", mx: 1, my: 0.5,
      background: isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.055)",
    }} />
  );
}

/* ── Sidebar root ── */
export default function Sidebar({ collapsed }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  const role   = useSelector((state) => state.auth.role);

  // Fall back to empty config if role is unrecognised
  const nav = useMemo(() => NAV_CONFIG[role] ?? { top: [], workspace: [], bottom: [] }, [role]);

  return (
    <Box sx={{
      width: collapsed ? 79 : 259,
      height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 1300,
      transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      display: "flex", flexDirection: "column",
      background: isDark ? "#0d0d18" : "#fff",
      borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#ede9fe"}`,
    }}>

      {/* Logo */}
      <Box sx={{
        height: 56, display: "flex", alignItems: "center",
        px: collapsed ? 0 : 2,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f3f0ff"}`,
      }}>
        <Box sx={{
          width: 33, height: 33, borderRadius: "10px",
          background: "linear-gradient(135deg,#6d28d9,#9333ea)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 15, flexShrink: 0,
          mr: collapsed ? 0 : 1.5,
          boxShadow: "0 4px 10px rgba(109,40,217,0.3)",
        }}>
          T
        </Box>
        {!collapsed && (
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14.5, color: isDark ? "#ede9fe" : "#1e1b4b", lineHeight: 1.2 }}>
              Taskify
            </Typography>
            <Typography sx={{ fontSize: 9.5, color: "#8b5cf6", fontWeight: 700, letterSpacing: "0.07em" }}>
              PRODUCTIVITY SUITE
            </Typography>
          </Box>
        )}
      </Box>

      {!collapsed && (
        <Typography sx={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em",
          color: isDark ? "#2e2e42" : "#ddd6fe",
          px: 2, pt: 2, pb: 0.5,
        }}>
          NAVIGATION
        </Typography>
      )}

      {/* Nav list */}
      <Box sx={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        px: 1, py: 0.5,
        display: "flex", flexDirection: "column", gap: 0.25,
        "&::-webkit-scrollbar": { width: 0 }, scrollbarWidth: "none",
      }}>
        {nav.top.map(item => (
          <Row key={item.path} item={item} collapsed={collapsed} />
        ))}

        {nav.workspace.length > 0 && <NavDivider />}
        <WorkspaceGroup collapsed={collapsed} items={nav.workspace} />

        {nav.bottom.length > 0 && <NavDivider />}
        {nav.bottom.map(item => (
          <Row key={item.path} item={item} collapsed={collapsed} />
        ))}
      </Box>

      {/* Pinned bottom card */}
      {!collapsed && (
        <Box sx={{ p: 1.5, flexShrink: 0 }}>
          <Box sx={{
            px: 2, py: 1.75, borderRadius: "14px",
            background: isDark
              ? "rgba(109,40,217,0.2)"
              : "linear-gradient(135deg,#6d28d9,#9333ea)",
            border: isDark ? "1px solid rgba(124,58,237,0.28)" : "none",
            position: "relative", overflow: "hidden",
          }}>
            <Box sx={{ position: "absolute", right: -8, top: -8, width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", right: 18, bottom: -16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.4 }}>
              <RocketLaunchRounded sx={{ fontSize: 13, color: isDark ? "#c4b5fd" : "rgba(255,255,255,0.8)" }} />
              <Typography sx={{ fontWeight: 800, fontSize: 12.5, color: "#fff", lineHeight: 1 }}>
                Need Focus?
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}>
              Finish tasks faster today 🚀
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}