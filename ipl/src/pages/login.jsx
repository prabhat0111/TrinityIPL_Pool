import React, { useState } from "react";
import "./login.css";

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
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store JWT token
        localStorage.setItem("token", data.access_token);

        // ✅ redirect to dashboard
        window.location.href = "/leaderboard";
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
      <div className="overlay"></div>

      <form className="login-box" onSubmit={handleSubmit}>
        <h2>WELCOME BACK</h2>
        <p>Enter the arena and claim your winning streak</p>

        {/* USERNAME / EMAIL */}
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
              placeholder="Enter Password"
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

        {/* SUBMIT */}
        <button type="submit" className="login-btn">
          SIGN IN →
        </button>
      </form>
    </div>
  );
}

export default Login;