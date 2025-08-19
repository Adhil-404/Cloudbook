import { useState } from 'react';
import axios from 'axios';

export default function UserResetpassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('resetToken');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Reset</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
