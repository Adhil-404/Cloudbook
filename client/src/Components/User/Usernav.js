import React from 'react';
import "../../Assets/Styles/Userstyles/userNav.css";
import { FaSearch, FaPhoneAlt, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { BsEnvelope } from 'react-icons/bs';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';


function Usernav() {
  return (

    <header className="homepage-header">
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

      <div className="header-middle">
        <div className="logo">cloudbook</div>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All category</option>
            <option>Fantacy</option>
            <option>Crime</option>
            <option>Romance</option>
            <option>Horror</option>
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
    </header>
  );
}

export default Usernav;
