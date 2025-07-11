import React from 'react';
import "../../Assets/Styles/Userstyles/userNav.css";
import { Link } from 'react-router-dom';



function UserNav() {
  return (
    <div>
      <div className="header-top">
        <div className="contact-info">
          <i class="bi bi-telephone"></i> <span>+(84) - 1800 - 4635</span>
          <i class="bi bi-envelope"></i> <span>Info@BookStore.com</span>
        </div>
        <div className="top-icons">
          <i class="bi bi-person"></i>
          <i class="bi bi-instagram" ></i>
          <i class="bi bi-twitter"></i>
        </div>
      </div>

      <div className="header-middle">
        <div className="logo">cloudbook</div>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All category</option>
            <option>Fantasy</option>
            <option>Crime</option>
            <option>Romance</option>
            <option>Horror</option>
          </select>
          <button><i class="bi bi-search"></i></button>
        </div>
        <div className="middle-icons">
          <span>login</span><i class="bi bi-person-fill"></i>
          
          <i class="bi bi-heart-fill"></i>
           <Link to="/user/homepage/cart"><i class="bi bi-cart-fill"></i></Link>
        </div>
      </div>

      <header className="homepage-header">
        <div className="header-bottom">
          <button className="categories-btn">☰ Categories</button>
        </div>
        <div>
          <nav className="nav-links">
            <a href="#">Home</a>
           <Link to="/user/hompepage/product"> <a href="#">Products</a></Link>
           <Link to="/user/hompepage/contact"><a href="#">Contact</a></Link> 
            <a href="#">About Us</a>
          </nav>
        </div>
        <div className="support-info">
          <i class="bi bi-telephone"></i>  <span>+1 840 - 841 25 69</span>
          <p>24/7 Support Center</p>
        </div>
      </header>
    </div>

  );

}

export default UserNav;
