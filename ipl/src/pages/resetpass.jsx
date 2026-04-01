import React, { useState } from "react";
import "./resetpass.css";
import Sidebar from "../components/sidebar";

function ResetPass() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    console.log({ email, oldPassword, newPassword });
  };

  return (
    <div className="layout">
      <Sidebar />

      {/* 🔥 Scoped page class */}
      <div className="main-content reset-page">
        <div className="reset-wrapper">
          <form className="reset-card" onSubmit={handleSubmit}>
            
            <div className="icon-box">🔄</div>

            <h2>Update Your Password</h2>
            <p>
              Enter your details below to securely update your account password.
            </p>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-field">
                <span>📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                />
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
                <span onClick={() => setShowOld(!showOld)}>👁️</span>
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
                <span onClick={() => setShowNew(!showNew)}>👁️</span>
              </div>
            </div>

            <button type="submit" className="reset-btn">
              Update Password →
            </button>

            <p className="back-login">← Back to Login</p>

            <div className="footer">
              <span>🔒 Secure SSL</span>
              <span>🛡 Privacy First</span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;