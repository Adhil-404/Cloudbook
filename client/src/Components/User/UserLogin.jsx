import React, { useState } from 'react'
import '../../Assets/Styles/Userstyles/UserLogin.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserLogin() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


const handleSubmit = (e) => {
  e.preventDefault();

  axios.post("http://localhost:5000/userlogin", { email, password })
    .then((res) => {
      const token = res.data.token;
      if (token) {
        localStorage.setItem("userToken", token); 
        navigate('/user/dashboard');
      } else {
        alert("Login failed: No token received");
      }
    })
    .catch((err) => {
  console.error("Full error object:", err);
  console.error("Error response:", err.response);
  console.error("Error data:", err.response?.data);
  alert(err.response?.data?.err || "Login failed");
});

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
                autoComplete='password'
                required
              />
            </div>
            <div className="options">
              <label className='remember'>
                <input type="checkbox" /> Remember me
              </label>
              <Link to='/user/forgetpassword'>Forgot password?</Link>
            </div>
            <button type="submit" className="btn-signin">Sign In</button>
            <div className="signup">
              <p className='pass-detail'>Don't have an account? <Link to='/user_reg' className='sign-link'> sign up</Link></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default UserLogin;