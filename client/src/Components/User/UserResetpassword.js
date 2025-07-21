import React from 'react'
import '../../Assets/Styles/Userstyles/UserResetpassword.css'

function UserResetpassword() {
  return (
    <div>
        <div className="container">
      <div className="reset-card">
        <h2 className="title">Reset Password</h2>
        <form>
          <div className="input-group">
            <label className="label">New Password</label>
            <input type="password" required className="input" />
          </div>
          <div className="input-group">
            <label className="label">Confirm Password</label>
            <input type="password" required className="input" />
          </div>
          <button type="submit" className="button">Reset Password</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default UserResetpassword