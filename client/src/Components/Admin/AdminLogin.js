import React, { useState } from 'react';
import '../../Assets/Styles/Adminstyles/AdminLogin.css';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

   
    
    if (email === 'admin@cloudbook.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="left_container">
          <h2>Welcome to</h2>
          <h1>CloudBooks</h1>
          <p>
            Manage your bookstore efficiently with CloudBooks. Add books,
            process orders, and keep track of your inventory seamlessly.
          </p>
        </div>
        <div className="right_container">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
            </div>
            <button type="submit" className="btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
