import React from 'react'
import '../../Assets/Styles/Userstyles/UserForgetpassword.css'
import { Link } from 'react-router-dom'

function UserForgetpassword() {
  
  
  return (
    
    <div>
      


    <div className="container">
      <div className="forget-card">
        <h2 className="title">Forgot Password</h2>
        <form>
          <div className="input-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              required
              className="input"
            />
          </div>
           < Link to={'/user/restpassword'}> <button type="submit" className="button">
            Reset Password
          </button></Link>
        </form>
      </div>
    </div>
  

    </div>
  )
}

export default UserForgetpassword