import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import bgImage from "../assets/bg1.avif"; 

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Content */}
      <div
        className="flex-grow-1 dashboard-main"
        style={{
          marginLeft: collapsed ? "80px" : "250px",
          transition: "all 0.3s ease",
          position: "relative",
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Topbar */}
        <Topbar toggleSidebar={() => setCollapsed(!collapsed)} />

        {/* Page content */}
        <div className="dashboard-page p-4">
          {/* Optional overlay */}
          <div className="dashboard-overlay"></div>

          {/* Actual content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
