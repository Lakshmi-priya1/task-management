import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaTasks, FaProjectDiagram } from "react-icons/fa";
import "../assets/Sidebar.css";
function Sidebar({ collapsed }) {
  return (
    <div
      className="sidebar"
      style={{
        width: collapsed ? "80px" : "250px",
        transition: "width 0.3s ease",
      }}
    >
      <div className="sidebar-content">
        <div className="logo">{collapsed ? "AP" : "Admin Panel"}</div>

        <ul className="menu">
          {!collapsed && <p className="menu-title">MAIN</p>}

          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaHome className="icon" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>

          {!collapsed && <p className="menu-title">MANAGEMENT</p>}

          <li>
            <NavLink
              to="/dashboard/employee"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaUsers className="icon" />
              {!collapsed && <span>Employees</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaTasks className="icon" />
              {!collapsed && <span>Tasks</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
