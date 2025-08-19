import { useState } from 'react';
import axios from 'axios';

export default function UserForgetpasswordr() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/auth/request-password-reset', { email });
    setMsg(res.data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Send OTP</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
