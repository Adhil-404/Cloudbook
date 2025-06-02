import React from 'react';
import "../../Assets/Styles/Userstyles/Header.css"
import { FaSearch, FaPhoneAlt, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { BsEnvelope } from 'react-icons/bs';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';

const Header = () => {
  return (
    <div>
      {/* Top black bar */}
      <div className="header-top">
        <div className="contact-info">
          <FaPhoneAlt /> <span>+(84) - 1800 - 4635</span>
          <BsEnvelope /> <span>Info@BookStore.com</span>
        </div>
        <div className="top-icons">
          <FaUser />
          <AiOutlineInstagram />
          <AiOutlineTwitter />
        </div>
      </div>

      {/* Middle bar with logo and search */}
      <div className="header-middle">
        <div className="logo">cloudbook</div>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All category</option>
          </select>
          <button><FaSearch /></button>
        </div>
        <div className="middle-icons">
          <span>Find a book store</span>
          <FaUser />
          <FaHeart />
          <FaShoppingCart />
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className="header-bottom">
        <button className="categories-btn">☰ Categories</button>
        <nav>
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
          <a href="#">About Us</a>
        </nav>
        <div className="support-info">
          <FaPhoneAlt /> <span>+1 840 - 841 25 69</span>
          <p>24/7 Support Center</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
