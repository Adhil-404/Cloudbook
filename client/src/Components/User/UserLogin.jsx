import React, { useState } from 'react';
import '../../Assets/Styles/Userstyles/UserLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/user/userlogin", { email, password });

      const { token, user } = response.data;

      if (!token) {
        alert("Login failed: No token received");
        return;
      }

      // Store token
      localStorage.setItem("userToken", token);

      // Store user info
      if (user) {
        const userInfo = {
          _id: user._id,
          name: user.userName || user.fullName || "",
          username: user.userName || user.username || "",
          email: user.userEmail || user.email || ""
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        console.log("User info saved:", userInfo);
      }

      console.log("Token saved successfully:", token);
      navigate('/user/homepage');

    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.err || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="left_container">
          <h2>Welcome to</h2>
          <h1>CloudBooks</h1>
          <p className='intro-detail'>
            Manage your bookstore efficiently with CloudBooks. Add books,
            process orders, and keep track of your inventory seamlessly.
          </p>
        </div>
        <div className="right_container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="options">
              <label className='remember'>
                <input type="checkbox" /> Remember me
              </label>
              <Link to='/user/forgetpassword'>Forgot password?</Link>
            </div>

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="signup">
              <p className='pass-detail'>
                Don't have an account? <Link to='/user_reg' className='sign-link'>Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
