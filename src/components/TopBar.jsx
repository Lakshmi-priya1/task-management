import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../assets/Topbar.css";

function Topbar({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // LOGOUT
  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.clear();
    window.location.href = "/";
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // GET USERNAME FROM TOKEN
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsername("User");
        return;
      }

      const decoded = jwtDecode(token);

      const rawName =
        decoded?.username || decoded?.email || decoded?.sub || "User";

      const nameOnly = rawName.includes("@") ? rawName.split("@")[0] : rawName;

      const formattedName =
        nameOnly.charAt(0).toUpperCase() + nameOnly.slice(1);

      setUsername(formattedName);
    } catch (error) {
      console.error("Token decode error:", error);
      setUsername("User");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar-container shadow-sm">
      {/* Sidebar Toggle */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* USER DROPDOWN */}
      <div className="dropdown" ref={dropdownRef}>
        <button className="profile-btn" onClick={toggleDropdown}>
          {/* Avatar */}
          <div className="avatar-circle">{username.charAt(0)}</div>

          {/* Text */}
          <span className="welcome-text">
            Welcome, <span className="username">{username}</span>
          </span>

          {/*Arrow */}
          <span className={`arrow ${dropdownOpen ? "open" : ""}`}>▼</span>
        </button>

        <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
          <li>
            <Link
              className="dropdown-item"
              to="/dashboard/change-password"
              onClick={closeDropdown}
            >
              Change Password
            </Link>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Topbar;
