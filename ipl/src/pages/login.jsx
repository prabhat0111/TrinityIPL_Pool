import React, { useState } from "react";
import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <div className="login-box">
        <h2>WELCOME BACK</h2>
        <p>Enter the arena and claim your winning streak</p>
        
        <div className="input-group">
          <label>USERNAME OR EMAIL</label>
          <div className="input-field">
            <span className="icon">👤</span>
            <input type="text" placeholder="Enter your ID" />
          </div>
        </div>

        <div className="input-group">
          <label>PASSWORD</label>
          <div className="input-field">
            <span className="icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <span className="forgot">Forgot Password?</span>
        </div>

        <button className="login-btn">
          SIGN IN →
        </button>

        <p className="register">
          New User? <span>Register Now</span>
        </p>
      </div>
    </div>
  );
}

export default Login;