import React, { useState, useEffect } from "react";
import "./resetpass.css";
import Sidebar from "../components/sidebar";
import { BASE_URL } from "./config";
import { fetchWithAuth } from "../utils/fetchWithAuth";

function ResetPass() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);

  // FETCH PROFILE TO AUTO-FILL EMAIL
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        // const res = await fetch("http://localhost:8000/profile", {

        // const res = await fetch(`${BASE_URL}/profile`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        // token 
        const res = await fetchWithAuth("/profile");
        // token 

        const data = await res.json();
        if (res.ok) setUser(data);
        else alert("Failed to load profile");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
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

    const token = localStorage.getItem("token");

    try {
      // const res = await fetch("http://localhost:8000/reset-password", {
      // const res = await fetch(`${BASE_URL}/reset-password`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     email: user.email, // auto-filled
      //     oldPassword,
      //     newPassword,
      //   }),
      // });

      // token 
      const res = await fetchWithAuth("/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: user.email, // auto-filled
          oldPassword,
          newPassword,
        }),
      });
      // token 

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully ✅");
        e.target.reset();
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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