

import React from "react";
import '../../Assets/Styles/Adminstyles/AdminDashboard.css';
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admindashboard-container">
      <h2 className="admindash-logo">CloudBook</h2>
      <div className="admindash-top-bar"></div>

      <aside className="admindash-sidebar">
        <ul className="admindash-nav-links">
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/books">Books</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/reviews">Reviews</Link></li>
          <li><Link to="/admin/settings">Settings</Link></li>
        </ul>
      </aside>

      <div className="admindash-main-content">
        <h1>Admin Dashboard</h1>


        <div className="admindash-stats">
          <div className="admindash-card">
            <h3>Total Books</h3>
            <p>120</p>
          </div>
          <div className="admindash-card">
            <h3>Total Orders</h3>
            <p>45</p>
          </div>
          <div className="admindash-card">
            <h3>Users</h3>
            <p>300</p>
          </div>
        </div>


        <div className="admindash-recent-activity">
          <h3>Recent Activity</h3>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>📚 Book Added</td>
                <td>"React for Beginners"</td>
                <td>10 mins ago</td>
              </tr>
              <tr>
                <td>🛒 Order Placed</td>
                <td>Order #12345</td>
                <td>30 mins ago</td>
              </tr>
              <tr>
                <td>👤 New User</td>
                <td>Sarah Johnson</td>
                <td>1 hour ago</td>
              </tr>
              <tr>
                <td>✍️ Review Submitted</td>
                <td>"Great Book!" - by Alex</td>
                <td>2 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


