import React, { useState } from 'react';
import '../../Assets/Styles/Userstyles/ContactForm.css';
import UserNav from './Usernav';
import { Link } from 'react-router-dom';

function ContactForm() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: 'general',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Contact form submitted:', contactForm);

    setFormSubmitted(true);

    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        inquiryType: 'general',
        message: ''
      });
      setFormSubmitted(false);
    }, 3000);
  };

  const storeInfo = {
    address: "123 Book Street, Literature District",
    city: "Reading City, RC 12345",
    phone: "+(84) - 1800 - 4635",
    email: "Info@BookStore.com",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM"
    }
  };

  const departments = [
    {
      name: "Customer Service",
      email: "support@cloudbook.com",
      phone: "+1 840 - 841 25 69",
      description: "General inquiries and customer support"
    },
    {
      name: "Book Acquisitions",
      email: "acquisitions@cloudbook.com",
      phone: "+1 840 - 841 25 70",
      description: "Selling books to our store"
    },
    {
      name: "Corporate Sales",
      email: "corporate@cloudbook.com",
      phone: "+1 840 - 841 25 71",
      description: "Bulk orders and business partnerships"
    },
    {
      name: "Media & Press",
      email: "media@cloudbook.com",
      phone: "+1 840 - 841 25 72",
      description: "Press releases and media inquiries"
    }
  ];

  const socialLinks = [
    { platform: "Facebook", icon: "bi-facebook", url: "#" },
    { platform: "Twitter", icon: "bi-twitter", url: "#" },
    { platform: "Instagram", icon: "bi-instagram", url: "#" },
    { platform: "LinkedIn", icon: "bi-linkedin", url: "#" },
    { platform: "YouTube", icon: "bi-youtube", url: "#" }
  ];

  return (
    <div>
      <div><UserNav /></div>
      <div className="contact-container">
        <div className="contact-hero">
          <div className="hero-content">
            <h1>
              <i className="bi bi-envelope-heart"></i>
              Get in Touch
            </h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="hero-image">
            <i className="bi bi-chat-dots"></i>
          </div>
        </div>

        <div className="quick-contact">
          <div className="quick-contact-item">
            <div className="icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div className="info">
              <h4>Visit Our Store</h4>
              <p>{storeInfo.address}</p>
              <p>{storeInfo.city}</p>
            </div>
          </div>

          <div className="quick-contact-item">
            <div className="icon">
              <i className="bi bi-telephone-fill"></i>
            </div>
            <div className="info">
              <h4>Call Us</h4>
              <p>{storeInfo.phone}</p>
              <p>24/7 Customer Service</p>
            </div>
          </div>

          <div className="quick-contact-item">
            <div className="icon">
              <i className="bi bi-envelope-fill"></i>
            </div>
            <div className="info">
              <h4>Email Us</h4>
              <p>{storeInfo.email}</p>
              <p>Response within 24 hours</p>
            </div>
          </div>

          <div className="quick-contact-item">
            <div className="icon">
              <i className="bi bi-clock-fill"></i>
            </div>
            <div className="info">
              <h4>Store Hours</h4>
              <p>Mon-Fri: {storeInfo.hours.weekdays}</p>
              <p>Sat: {storeInfo.hours.saturday}</p>
              <p>Sun: {storeInfo.hours.sunday}</p>
            </div>
          </div>
        </div>

        <div className="contact-main">
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <p>Have a question or want to get in touch? Fill out the form below and we'll get back to you soon.</p>

            {formSubmitted ? (
              <div className="success-message">
                <i className="bi bi-check-circle-fill"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleFormChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type *</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={contactForm.inquiryType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="bulk-order">Bulk Orders</option>
                      <option value="book-selling">Sell Books to Us</option>
                      <option value="media">Media & Press</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="careers">Career Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleFormChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  <i className="bi bi-send"></i>
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="store-info-section">
            <div className="map-section">
              <h3>Find Our Store</h3>
              <div className="map-placeholder">
                <i className="bi bi-geo-alt"></i>
                <p className='mapp'>Interactive Map Coming Soon</p>
                <p className="map-address">
                  {storeInfo.address}<br />
                  {storeInfo.city}
                </p>
              </div>
            </div>

            <div className="departments-section">
              <h3>Contact Departments</h3>
              <div className="departments-list">
                {departments.map((dept, index) => (
                  <div key={index} className="department-card">
                    <h4>{dept.name}</h4>
                    <p className="dept-description">{dept.description}</p>
                    <div className="dept-contacts">
                      <a href={`mailto:${dept.email}`} className="dept-contact">
                        <i className="bi bi-envelope"></i>
                        {dept.email}
                      </a>
                      <a href={`tel:${dept.phone}`} className="dept-contact">
                        <i className="bi bi-telephone"></i>
                        {dept.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <p>Stay connected with us on social media for the latest updates, book recommendations, and special offers.</p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.url} className="social-link" title={social.platform}>
                    <i className={social.icon}></i>
                    <span>{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="faq-preview">
          <h3>Frequently Asked Questions</h3>
          <p>Looking for quick answers? Check out our most common questions.</p>
          <div className="faq-items">
            <div className="faq-item">
              <h4>What are your shipping options?</h4>
              <p>We offer standard, express, and next-day delivery options. Free shipping on orders over $35.</p>
            </div>
            <div className="faq-item">
              <h4>Do you buy used books?</h4>
              <p>Yes! Contact our Book Acquisitions department for more information about selling your books to us.</p>
            </div>
            <div className="faq-item">
              <h4>Can I visit your physical store?</h4>
              <p>Absolutely! Visit us at our location during business hours. See store hours above.</p>
            </div>
          </div>
          <button className="view-all-faq">
            View All FAQs
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for book recommendations, exclusive offers, and store updates.</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <Link to='/user/subscribe'><button>
                <i className="bi bi-envelope-plus"></i>Subscribe
              </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;