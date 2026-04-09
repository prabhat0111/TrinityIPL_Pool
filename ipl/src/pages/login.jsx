import React, { useState } from "react";
import "./login.css";
import logo from "../assets/logo.jpg";
import { BASE_URL } from "./config";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
      // ✅ FALLBACK FIX (IMPORTANT)
      // const API_URL =
      //   import.meta.env.VITE_API_URL || "http://localhost:8000";

      // const res = await fetch(`${API_URL}/login`, {
      const res = await fetch(`${BASE_URL}/login`, {

        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.user.role);

        if (data.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        
        {/* LOGO */}
        <div className="login-logo-container">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <p className="tag">WELCOME TO TRINITY IPL</p>
        <h2>LOGIN</h2>

        {/* USERNAME */}
        <div className="input-group">
          <label>USERNAME OR EMAIL</label>
          <div className="input-field">
            <span className="icon">👤</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <label>PASSWORD</label>
          <div className="input-field">
            <span className="icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              required
            />
            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button type="submit" className="login-btn">
          ENTER ARENA →
        </button>
      </form>
    </div>
  );
}

export default Login;