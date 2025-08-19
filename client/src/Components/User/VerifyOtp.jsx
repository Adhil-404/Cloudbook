import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-reset-otp', { email, otp });
      const token = res.data.token;
      localStorage.setItem('resetToken', token);
      navigate('/reset-password');
    } catch (err) {
      setMsg(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify OTP</h2>
      <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
      <input type="text" value={otp} required onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
