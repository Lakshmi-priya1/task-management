import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/SideBar";
import Topbar from "../components/TopBar";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />

      <Box
        sx={{
          flexGrow: 1,
          ml: collapsed ? "80px" : "260px",
          transition: "0.3s ease",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 40%,#c4b5fd 100%)",
        }}
      >
        <Topbar toggleSidebar={() => setCollapsed(!collapsed)} />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}