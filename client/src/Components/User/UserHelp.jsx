import React, { useState, useEffect } from 'react';
import '../../Assets/Styles/Userstyles/UserHelp.css';
import UserNav from './Usernav';

function UserHelp() {
  const [activeSection, setActiveSection] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by going to "My Orders" section in your account. There you\'ll find real-time tracking information and estimated delivery dates. You\'ll also receive email notifications with tracking updates.'
    },
    {
      id: 2,
      category: 'orders',
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placement. After this time, the order enters our fulfillment process and cannot be changed. To cancel an order, visit "My Orders" and click the "Cancel" button if available.'
    },
    {
      id: 3,
      category: 'shipping',
      question: 'What are your shipping options and costs?',
      answer: 'We offer standard shipping (5-7 business days) for $4.99, express shipping (2-3 business days) for $9.99, and next-day delivery for $19.99. Free standard shipping is available on orders over $35.'
    },
    {
      id: 4,
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping costs vary by destination and typically takes 7-14 business days. Customs fees may apply and are the responsibility of the customer.'
    },
    {
      id: 5,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for a full refund. Books must be in original condition. To initiate a return, go to "My Orders" and select "Return Item". We provide prepaid return labels for your convenience.'
    },
    {
      id: 6,
      category: 'returns',
      question: 'How long does it take to process a refund?',
      answer: 'Refunds are processed within 3-5 business days after we receive your returned item. The refund will be credited to your original payment method. You\'ll receive an email confirmation once the refund is processed.'
    },
    {
      id: 7,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link within a few minutes. If you don\'t see the email, check your spam folder.'
    },
    {
      id: 8,
      category: 'account',
      question: 'How can I update my account information?',
      answer: 'Log into your account and go to "Account Settings" or "My Profile". There you can update your personal information, shipping addresses, and communication preferences.'
    },
    {
      id: 9,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with SSL encryption.'
    },
    {
      id: 10,
      category: 'payment',
      question: 'Is it safe to use my credit card on your website?',
      answer: 'Yes, absolutely. We use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store your full credit card details on our servers.'
    },
    {
      id: 11,
      category: 'books',
      question: 'Are your books new or used?',
      answer: 'All books in our inventory are brand new unless specifically marked as "Used" or "Refurbished". We work directly with publishers and authorized distributors to ensure quality and authenticity.'
    },
    {
      id: 12,
      category: 'books',
      question: 'Do you offer e-books or digital formats?',
      answer: 'Currently, we specialize in physical books only. However, we\'re working on adding e-book options in the near future. Sign up for our newsletter to be notified when digital formats become available.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics', icon: 'bi-grid-3x3-gap' },
    { value: 'orders', label: 'Orders', icon: 'bi-bag-check' },
    { value: 'shipping', label: 'Shipping', icon: 'bi-truck' },
    { value: 'returns', label: 'Returns', icon: 'bi-arrow-repeat' },
    { value: 'account', label: 'Account', icon: 'bi-person-gear' },
    { value: 'payment', label: 'Payment', icon: 'bi-credit-card' },
    { value: 'books', label: 'Books', icon: 'bi-book' }
  ];

  const contactMethods = [
    {
      icon: 'bi-telephone-fill',
      title: 'Phone Support',
      info: '+1 840 - 841 25 69',
      availability: '24/7 Support',
      description: 'Speak directly with our support team'
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email Support',
      info: 'support@cloudbook.com',
      availability: 'Response within 24 hours',
      description: 'Send us detailed questions or concerns'
    },
    {
      icon: 'bi-chat-dots-fill',
      title: 'Live Chat',
      info: 'Available Now',
      availability: '9 AM - 9 PM EST',
      description: 'Get instant help from our team'
    },
    {
      icon: 'bi-headset',
      title: 'Video Call',
      info: 'Schedule a call',
      availability: 'By appointment',
      description: 'Face-to-face support for complex issues'
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    setTicketSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
      setTicketSubmitted(false);
    }, 3000);
  };

  const handleFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div>
        <div><UserNav/></div>
    <div className="help-support-container">
      <div className="help-header">
        <h1>
          <i className="bi bi-question-circle-fill"></i>
          Help & Support Center
        </h1>
        <p>We're here to help you with any questions or concerns</p>
      </div>

      <div className="help-navigation">
        <button
          className={`nav-btn ${activeSection === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveSection('faq')}
        >
          <i className="bi bi-question-square"></i>
          Frequently Asked Questions
        </button>
        <button
          className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          <i className="bi bi-envelope"></i>
          Contact Support
        </button>
        <button
          className={`nav-btn ${activeSection === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveSection('resources')}
        >
          <i className="bi bi-book"></i>
          Resources & Guides
        </button>
      </div>

      {activeSection === 'faq' && (
        <div className="faq-section">
          <div className="faq-controls">
            <div className="search-bar">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <i className={category.icon}></i>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="faq-list">
            {filteredFAQs.length === 0 ? (
              <div className="no-results">
                <i className="bi bi-search"></i>
                <h3>No results found</h3>
                <p>Try adjusting your search terms or browse different categories</p>
              </div>
            ) : (
              filteredFAQs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <i className={`bi ${expandedFAQ === faq.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="contact-section">
          <div className="contact-methods">
            <h3>Choose Your Preferred Contact Method</h3>
            <div className="contact-grid">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">
                    <i className={method.icon}></i>
                  </div>
                  <h4>{method.title}</h4>
                  <p className="contact-info">{method.info}</p>
                  <p className="contact-availability">{method.availability}</p>
                  <p className="contact-description">{method.description}</p>
                  <button className="contact-action-btn">
                    {method.title.includes('Phone') ? 'Call Now' :
                     method.title.includes('Email') ? 'Send Email' :
                     method.title.includes('Chat') ? 'Start Chat' : 'Schedule Call'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h3>Submit a Support Ticket</h3>
            {ticketSubmitted ? (
              <div className="success-message">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Ticket Submitted Successfully!</h4>
                <p>We've received your support request and will respond within 24 hours. You'll receive a confirmation email shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={contactForm.category}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="orders">Order Issues</option>
                      <option value="shipping">Shipping Problems</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="account">Account Issues</option>
                      <option value="payment">Payment Problems</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={contactForm.priority}
                      onChange={handleFormChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleFormChange}
                    required
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    required
                    rows="6"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <button type="submit" className="submit-ticket-btn">
                  <i className="bi bi-send"></i>
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeSection === 'resources' && (
        <div className="resources-section">
          <h3>Helpful Resources & Guides</h3>
          
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-book"></i>
              </div>
              <h4>Getting Started Guide</h4>
              <p>Learn how to create an account, browse books, and place your first order.</p>
              <button className="resource-btn">Read Guide</button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-cart"></i>
              </div>
              <h4>Shopping Tutorial</h4>
              <p>Discover features like wishlists, reviews, and recommendations to enhance your shopping experience.</p>
              <button className="resource-btn">Watch Video</button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-truck"></i>
              </div>
              <h4>Shipping Information</h4>
              <p>Everything you need to know about our shipping options, costs, and delivery times.</p>
              <button className="resource-btn">Learn More</button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <h4>Returns & Exchanges</h4>
              <p>Step-by-step guide on how to return or exchange items with our hassle-free process.</p>
              <button className="resource-btn">View Process</button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <h4>Account Security</h4>
              <p>Tips and best practices for keeping your account secure and protecting your personal information.</p>
              <button className="resource-btn">Security Tips</button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-credit-card"></i>
              </div>
              <h4>Payment Methods</h4>
              <p>Information about accepted payment methods, billing, and how to manage your payment options.</p>
              <button className="resource-btn">Payment Info</button>
            </div>
          </div>

          <div className="quick-links">
            <h4>Quick Links</h4>
            <div className="links-grid">
              <a href="#" className="quick-link">
                <i className="bi bi-file-text"></i>
                Terms of Service
              </a>
              <a href="#" className="quick-link">
                <i className="bi bi-shield"></i>
                Privacy Policy
              </a>
              <a href="#" className="quick-link">
                <i className="bi bi-info-circle"></i>
                About Us
              </a>
              <a href="#" className="quick-link">
                <i className="bi bi-newspaper"></i>
                Company Blog
              </a>
              <a href="#" className="quick-link">
                <i className="bi bi-people"></i>
                Community Forum
              </a>
              <a href="#" className="quick-link">
                <i className="bi bi-download"></i>
                Mobile App
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="emergency-contact">
        <div className="emergency-content">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div className="emergency-text">
            <h4>Need Immediate Help?</h4>
            <p>For urgent issues, call our 24/7 emergency line</p>
          </div>
          <button className="emergency-btn">
            <i className="bi bi-telephone-fill"></i>
            Call Now: +1 840 - 841 25 69
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default UserHelp;