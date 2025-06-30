import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import "../../Assets/Styles/Userstyles/ContactForm.css"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);


    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="container">
      {!isSubmitted ? (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="header">
              <h1 className="title">Get in Touch</h1>
              <p className="subtitle">We'll get back to you within 24 hours.</p>
            </div>

            <div className="name-group">
              <div className="form-group">
                <label htmlFor="firstName" className="label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="label">Message</label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-container">
                  <span className="spinner" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={36} />
          </div>
          <h2 className="success-title">Message Sent!</h2>
          <p className="success-text">Thanks for reaching out. We'll respond shortly.</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
