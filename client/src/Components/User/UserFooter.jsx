
import React from "react";
import "../../Assets/Styles/Userstyles/UserFooter.css"
import visaImg from "../../Assets/Images/visa-png.png";
import mastercardImg from "../../Assets/Images/mastercard.jpg"
import paytmImg from "../../Assets/Images/Paytm.jpg"
import gpayImg from "../../Assets/Images/gpay.png"

function UserFooter() {
    return (
        <div>

            <div className="order-detail">
                <ul>
                    <li>
                        Free Shipping<br />
                        <small>Free shipping for orders over 500/-</small>
                    </li>
                    <li>
                        Money Guarantee<br />
                        <small>Within 30 days for an exchange</small>
                    </li>
                    <li>
                        Online Support<br />
                        <small>24 hours a day, 7 days a week</small>
                    </li>
                    <li>
                        Flexible Payment<br />
                        <small>Pay with multiple credit cards</small>
                    </li>
                </ul>
            </div>

            <div className="app-detail">
                <div className="location">
                    <h3>CloudBooks</h3>
                    <p>Find a location nearest you.</p>
                    <p>See Our Stores</p><br />
                    <p>+(84) - 1800 - 4635</p>
                    <p>@CloudBooks.com</p>
                </div>

                <div className="footer-column">
                    <h4>Contact Info</h4>
                    <p>927 Phoenix Bldg , Quezon<br />
                        Ave , Quezon city</p>
                    <p>Mon - Fri: 9:00 - 20:00</p>
                    <p>Sat: 11:00 - 15:00</p>
                </div>

                <div className="explore">
                    <h4>Explore</h4>
                    <ul>
                        <li>About Us</li>
                        <li>Category</li>
                        <li>Products</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div className="footer-sub">
                    <h4>Subscribe</h4>
                    <p>Be the first to know about new collections & launches.</p>
                    <div className="subscribe-box">
                        <i className="bi bi-envelope"></i>
                        <input type="email" placeholder="Email address" />
                        <button>Subscribe </button>
                    </div>

                </div>
            </div>

            <div className="footer-bottom">
                <p className="bottom-text">© 2025 CloudBooks. All rights reserved.</p>
                <div className="payment-icons">
                    <img src={visaImg} className="visa"></img>
                    <img src={mastercardImg} className="mastercard"></img>
                    <img src={paytmImg} className="paytm"></img>
                    <img src={gpayImg} className="gpay"></img>
                </div>
                <div className="social-icons">
                    <i className="bi bi-snapchat"></i>
                    <i className="bi bi-pinterest"></i>
                    <i className="bi bi-facebook"></i>
                    <i className="bi bi-instagram"></i>
                </div>
            </div>
        </div>
    );
}

export default UserFooter;
