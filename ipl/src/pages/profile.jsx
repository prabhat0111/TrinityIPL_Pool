import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  if (!user) {
    return (
      <div className="page">
        <Sidebar />
        <div className="main-content">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
        <Sidebar />

        <div className="main-content">

            {/* 🔥 HEADER (NEW) */}
            <div className="profile-header">
            <h1>My Profile</h1>
            <p className="profile-subtitle">Manage your account details</p>
            </div>

            {/* 🔥 PROFILE CARD */}
            <div className="profile-card">

            {/* 🔥 AVATAR */}
            <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="profile-row">
                <span>Name</span>
                <span>{user.name}</span>
            </div>

            <div className="profile-row">
                <span>Email</span>
                <span>{user.email}</span>
            </div>

            <div className="profile-row">
                <span>Role</span>
                <span style={{ textTransform: "capitalize" }}>
                {user.role}
                </span>
            </div>

            <button
                className="reset-btn"
                onClick={() => (window.location.href = "/resetpass")}
            >
                🔐 Reset Password
            </button>

            </div>
        </div>
        </div>
  );
}

export default Profile;