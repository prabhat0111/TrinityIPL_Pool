import React, { useState } from "react";
import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page reload

    // You can fetch values like this
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log(username, password);

    // 👉 Later: call backend API here
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <form className="login-box" onSubmit={handleSubmit}>
        <h2>WELCOME BACK</h2>
        <p>Enter the arena and claim your winning streak</p>

        {/* USERNAME */}
        <div className="input-group">
          <label>USERNAME OR EMAIL</label>
          <div className="input-field">
            <span className="icon">👤</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your ID"
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

        {/* OPTIONS */}
        {/* <div className="options">
          <label>
            <input type="checkbox" name="remember" /> Remember Me
          </label>
          <span className="forgot">Forgot Password?</span>
        </div> */}

        {/* SUBMIT BUTTON */}
        <button type="submit" className="login-btn">
          SIGN IN →
        </button>

        {/* <p className="register">
          Signing First Time? <span>Reset Password</span>
        </p> */}
      </form>
    </div>
  );
}

export default Login;