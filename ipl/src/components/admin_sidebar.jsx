import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../assets/logo.jpg";


function Admin_Sidebar() {
  return (
    <div className="sidebar">
      
      {/* ===== LOGO ===== */}
      <h2 className="logo-text">Welcome Admin!</h2>

      {/* ===== MENU ===== */}
      <ul className="menu">
        
        <NavLink to="/admin">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              📊 All Matches
            </li>
          )}
        </NavLink>

        <NavLink to="/admin/add-match">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              ➕ Add Match
            </li>
          )}
        </NavLink>

        <NavLink to="/admin/enter-results">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              🏏 Enter Result
            </li>
          )}
        </NavLink>

        <NavLink to="/admin/add-user">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              👤 Add User
            </li>
          )}
        </NavLink>

      </ul>

      {/* ===== BOTTOM ===== */}
      <div className="bottom">
        
        <NavLink to="/resetpass">
          {({ isActive }) => (
            <p className={isActive ? "active-bottom" : ""}>
              🔐 Reset Password
            </p>
          )}
        </NavLink>

        {/* Optional: logout (recommended) */}
        <p onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          🚪 Logout
        </p>
                   <img src={logo} alt="Trinity Logo" className="sidebar-logo" />

      </div>
    </div>
  );
}

export default Admin_Sidebar;