import React, { useState } from 'react';
import "../../Assets/Styles/Userstyles/UserRegistration.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};


    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required!";
    if (!formData.dob) newErrors.dob = "Date of birth is required!";
    if (!formData.gender) newErrors.gender = "Gender is required!";
    if (!formData.password.trim()) newErrors.password = "Password is required!";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }


    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setMsg('');
      setIsError(true);
      return;
    } else {
      setFieldErrors({});
    }


    axios.post("http://localhost:5000/user_reg", formData)
      .then((res) => {
        console.log("Response from server:", res.data);

        if (res.data.status === 200) {
          setMsg(res.data.msg || "Registered successfully!");
          setIsError(false);
          setFieldErrors({});
        } else {
          if (res.data.msg === "Email already exists") {
            setFieldErrors({ email: "Email already exists" });
            setMsg('');
          } else {
            setMsg(res.data.msg || "Registration failed.");
            setFieldErrors({});
          }
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error("Axios registration error:", err);
        if (err.response && err.response.data) {
          const serverMsg = err.response.data.msg || "Server responded with an error";
          setMsg(serverMsg);
        } else {
          setMsg("Network error or server not reachable");
        }
        setIsError(true);
        setFieldErrors({});
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your CloudBooks Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && <p className="user-error-message">{fieldErrors.fullName}</p>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <p className="user-error-message">{fieldErrors.email}</p>}
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="123-456-7890"
              value={formData.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && <p className="user-error-message">{fieldErrors.phone}</p>}
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {fieldErrors.dob && <p className="user-error-message">{fieldErrors.dob}</p>}
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
            {fieldErrors.gender && <p className=" user-error-message">{fieldErrors.gender}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <p className="user-error-message">{fieldErrors.password}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirmPassword && <p className="user-error-message">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="UserReg_btn">Sign Up</button>

          {msg && (
            <p className={isError ? "user-error-message" : "success-message"}>{msg}</p>
          )}

          <p className="UserReg_login-link">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserRegistration;
