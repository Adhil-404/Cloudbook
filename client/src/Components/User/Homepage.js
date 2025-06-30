import React, { useEffect, useState } from 'react';
import "../../Assets/Styles/Userstyles/Homepage.css";
import UserNav from './Usernav';
import book2Img from "../../Assets/Images/book2.png"
import axios from 'axios';

function Homepage() {
  

  return (
    <div>
      <div><UserNav /></div>
      <div className='intro-'>
        <div className='intro-text'>
          <p className='high-text'>SPECIAL OFFER</p>
          <h1 className='middle-text'>There is nothing <br />
            better than to read</h1>
          <p className='low-text'>Find the Perfect Gift for Everyone on Your List</p>
          <button className='explore-btn'>SHOP NOW</button>
        </div>
        <img src={book2Img} className='books2-image' alt="Books" />
      </div>


    </div>
  );
}


export default Homepage;
