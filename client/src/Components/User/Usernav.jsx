import React from "react";
import { Link } from "react-router-dom";
import "../../Assets/Styles/Userstyles/userNav.css";

function UserNav() {
  return (
    <div>
      <div className="header-top">
        <div className="contact-info">
          <i className="bi bi-telephone" aria-label="Phone"></i>
          <span>+(84) - 1800 - 4635</span>
          <i className="bi bi-envelope" aria-label="Email"></i>
          <span>Info@BookStore.com</span>
        </div>
        <div className="top-icons">
          <i className="bi bi-person" aria-label="User Profile"></i>
          <i className="bi bi-instagram" aria-label="Instagram"></i>
          <i className="bi bi-twitter" aria-label="Twitter"></i>
        </div>
      </div>

      <div className="header-middle">
        <div className="logo">cloudbook</div>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." aria-label="Search products" />
          <select aria-label="Select category">
            <option>All category</option>
            <option>Fantasy</option>
            <option>Crime</option>
            <option>Romance</option>
            <option>Horror</option>
          </select>
          <button aria-label="Search">
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="middle-icons">
          <span>Login
  </span>
          <i className="bi bi-person-fill" aria-label="User"></i>
          <i className="bi bi-heart-fill" aria-label="Favorites"></i>
          <Link to="/user/homepage/cart" aria-label="Cart"> </Link>

          <i className="bi bi-person-fill"></i>
          <i className="bi bi-heart-fill"></i>
          <Link to="/user/homepage/cart">

            <i className="bi bi-cart-fill"></i>
          </Link>
        </div>
      </div>

      <header className="homepage-header">
        <div className="header-bottom">
          <button className="categories-btn" aria-label="Browse categories">
            ☰ Categories
          </button>
        </div>

        <nav className="nav-links">
          <Link to="/user/homepage">Home</Link>
          <Link to="/user/hompepage/product">Products</Link>
          <Link to="/user/hompepage/contact">Contact</Link>
          <Link to="/user/homepage/aboutus">About Us</Link>
        </nav>

        <div className="support-info">
          <i className="bi bi-telephone" aria-label="Support phone"></i>
          <span>+1 840 - 841 25 69</span>
          <p>24/7 Support Center</p>
        </div>
      </header>
    </div>
  );
}

export default UserNav;
