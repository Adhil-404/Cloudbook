import React, { useState } from 'react';
import '../../Assets/Styles/Userstyles/Subscribe.css';
import UserNav from './Usernav';

function Subscribe() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        interests: [],
        frequency: 'weekly'
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                interests: checked
                    ? [...prev.interests, value]
                    : prev.interests.filter(interest => interest !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            
               
                <div className="subscribe-container">
                    <div className="success-message">
                        <i className="bi bi-check-circle-fill"></i>
                        <h3>Welcome to CloudBooks!</h3>
                        <p>Thank you for subscribing! You'll receive our latest updates and exclusive offers at {formData.email}</p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="back-btn"
                        >
                            <i className="bi bi-arrow-left"></i>
                            Subscribe Another
                        </button>
                    </div>
                </div>
                );
    }

                return (
                <div> <div><UserNav /></div>
                <div className="subscribe-container">
                    <div className="subscribe-hero">
                        <div className="hero-content">
                            <h1>
                                <i className="bi bi-envelope-heart"></i>
                                Stay Connected
                            </h1>
                            <p>Join thousands of book lovers and be the first to discover new arrivals, exclusive deals, and literary adventures.</p>
                        </div>
                        <div className="hero-image">
                            <i className="bi bi-book-half"></i>
                        </div>
                    </div>

                    <div className="benefits-section">
                        <h2>What You'll Get</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className="bi bi-lightning"></i>
                                </div>
                                <h4>Early Access</h4>
                                <p>Be the first to know about new releases and limited edition books</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className="bi bi-percent"></i>
                                </div>
                                <h4>Exclusive Discounts</h4>
                                <p>Subscriber-only deals and special pricing on bestsellers</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className="bi bi-bookmark-star"></i>
                                </div>
                                <h4>Curated Recommendations</h4>
                                <p>Personalized book suggestions based on your reading preferences</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className="bi bi-calendar-event"></i>
                                </div>
                                <h4>Author Events</h4>
                                <p>Priority invitations to book launches and author meet-and-greets</p>
                            </div>
                        </div>
                    </div>

                    <div className="subscribe-main">
                        <div className="subscribe-form-section">
                            <h2>Join Our Community</h2>
                            <p>Fill out the form below to customize your CloudBooks experience</p>

                            <form onSubmit={handleSubmit} className="subscribe-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reading Interests</label>
                                    <div className="interests-grid">
                                        {['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'History', 'Self-Help'].map(interest => (
                                            <label key={interest} className="interest-checkbox">
                                                <input
                                                    type="checkbox"
                                                    value={interest}
                                                    checked={formData.interests.includes(interest)}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="checkmark"></span>
                                                {interest}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="frequency">Email Frequency</label>
                                    <select
                                        id="frequency"
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                    >
                                        <option value="daily">Daily Updates</option>
                                        <option value="weekly">Weekly Newsletter</option>
                                        <option value="monthly">Monthly Digest</option>
                                        <option value="special">Special Offers Only</option>
                                    </select>
                                </div>

                                <button type="submit" className="subscribe-btn">
                                    <i className="bi bi-envelope-plus"></i>
                                    Subscribe Now
                                </button>
                            </form>
                        </div>

                        <div className="testimonials-section">
                            <h3>What Our Subscribers Say</h3>
                            <div className="testimonials">
                                <div className="testimonial-card">
                                    <div className="stars">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <p>"CloudBooks newsletter keeps me updated on all the latest releases. I've discovered so many amazing books through their recommendations!"</p>
                                    <div className="testimonial-author">
                                        <strong>Sarah M.</strong>
                                        <span>Book Enthusiast</span>
                                    </div>
                                </div>
                                <div className="testimonial-card">
                                    <div className="stars">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <p>"The exclusive discounts are fantastic! I've saved hundreds of dollars on books since subscribing."</p>
                                    <div className="testimonial-author">
                                        <strong>Mike R.</strong>
                                        <span>Regular Customer</span>
                                    </div>
                                </div>
                                <div className="testimonial-card">
                                    <div className="stars">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <p>"Love getting early access to new releases! CloudBooks always keeps me ahead of the reading curve."</p>
                                    <div className="testimonial-author">
                                        <strong>Emma L.</strong>
                                        <span>Avid Reader</span>
                                    </div>
                                </div>
                            </div>

                            <div className="newsletter-stats">
                                <div className="stat-card">
                                    <h4>50K+</h4>
                                    <p>Happy Subscribers</p>
                                </div>
                                <div className="stat-card">
                                    <h4>1M+</h4>
                                    <p>Books Recommended</p>
                                </div>
                                <div className="stat-card">
                                    <h4>98%</h4>
                                    <p>Satisfaction Rate</p>
                                </div>
                            </div>

                            <div className="privacy-notice">
                                <i className="bi bi-shield-check"></i>
                                <div>
                                    <h4>Your Privacy Matters</h4>
                                    <p>We respect your privacy and never share your information with third parties. You can unsubscribe at any time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default Subscribe;