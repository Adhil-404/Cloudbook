import React from "react";
import "../../Assets/Styles/Userstyles/UserDashboard.css";

function UserDashboard() {
    return (
      <div className="userdashboard-container">
        <h2 className="userdash-logo">CloudBook</h2>
        <div className="userdash-top-bar"></div>
  
        <aside className="userdash-sidebar">
          <ul className="userdash-nav-links">
            <li className="userdash-active">Dashboard</li>
            <li> Browse Books</li>
            <li> My Orders</li>
            <li> Wishlist</li>
            <li> Profile</li>
            <li> Settings</li>
          </ul>
        </aside>
  
        <div className="userdash-main-content">
          <h1>User Dashboard</h1>
          
          <div className="userdash-stats">
            <div className="userdash-card">
              <h3> Total Books Purchased</h3>
              <p>5</p>
            </div>
            <div className="userdash-card">
              <h3> Wishlist Items</h3>
              <p>8</p>
            </div>
            <div className="userdash-card">
              <h3> Pending Orders</h3>
              <p>2</p>
            </div>
          </div>
  
          <div className="userdash-recent-activity">
            <h3> Recent Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Order ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>"📘 The Alchemist"</td>
                  <td>#98765</td>
                  <td>🚚 Shipped</td>
                </tr>
                <tr>
                  <td>"📙 React Basics"</td>
                  <td>#12345</td>
                  <td>⏳ Processing</td>
                </tr>
                <tr>
                  <td>"📗 JavaScript Mastery"</td>
                  <td>#67890</td>
                  <td>✅ Delivered</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  export default UserDashboard;

