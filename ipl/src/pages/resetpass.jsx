import React, { useState, useEffect } from "react";
import "./resetpass.css";
import Sidebar from "../components/sidebar";
import { apiFetch } from "../api";

function ResetPass() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);

  // FETCH PROFILE TO AUTO-FILL EMAIL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/profile");
        setUser(data);
        if (data.password_reset) {
          window.location.href = data.role === "admin" ? "/admin" : "/dashboard";
        }
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
          alert("Failed to fetch profile");
        }
      }
    };
    fetchProfile();
  }, []);

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // CHECK PASSWORDS MATCH
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // CHECK OLD ≠ NEW PASSWORD
    if (newPassword === oldPassword) {
      alert("New password cannot be the same as old password ❌");
      return;
    }

    try {
      await apiFetch("/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: user.email, // auto-filled
          oldPassword,
          newPassword,
        }),
      });

      alert("Password updated successfully ✅");
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
      e.target.reset();
    } catch (err) {
      if (err.message !== "Session expired") {
        alert(err.data?.detail || "Server error");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content reset-page">
        <div className="reset-wrapper">
          <form className="reset-card" onSubmit={handleSubmit}>
            <div className="icon-box">🔄</div>
            <h2>Update Your Password</h2>
            <p>Enter your details below to securely update your account password.</p>

            {/* EMAIL (AUTO-FILLED) */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-field">
                <span>📧</span>
                <input type="email" value={user?.email || ""} readOnly />
              </div>
            </div>

            {/* OLD PASSWORD */}
            <div className="input-group">
              <label>Old Password</label>
              <div className="input-field">
                <span>🔒</span>
                <input
                  type={showOld ? "text" : "password"}
                  name="oldPassword"
                  placeholder="••••••••"
                  required
                />
                <span onClick={() => setShowOld(!showOld)}>👁</span>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="input-group">
              <label>New Password</label>
              <div className="input-field">
                <span>🔐</span>
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••"
                  required
                />
                <span onClick={() => setShowNew(!showNew)}>👁</span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-field">
                <span>🔐</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>👁</span>
              </div>
            </div>

            <button type="submit" className="reset-btn">
              Update Password →
            </button>

            <p
              className="back-login"
              onClick={() => (window.location.href = "/leaderboard")}
            >
              ← Back
            </p>

            <div className="footer">
              <span>🔒 Secure</span>
              <span>🛡 Protected</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;