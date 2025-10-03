import React, { useState, useEffect } from 'react';
import "../../Assets/Styles/Userstyles/Aboutus.css"
import UserFooter from './UserFooter';
import UserNav from './Usernav';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: '50,000+', label: 'Books in Collection' },
    { number: '15,000+', label: 'Happy Customers' },
    { number: '38', label: 'Years of Experience' },
    { number: '24/7', label: 'Online Support' }
  ];

  const values = [
    {
      icon: '📚',
      title: 'Curated Selection',
      description: 'Every book in our collection is carefully selected for quality and relevance to our community of readers.'
    },
    {
      icon: '🌟',
      title: 'Customer First',
      description: 'Your reading experience is our priority. We provide personalized recommendations and exceptional service.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We embrace technology to enhance your book discovery and shopping experience while preserving the love of reading.'
    },
    {
      icon: '💚',
      title: 'Sustainability',
      description: 'We\'re committed to eco-friendly practices and supporting authors who share our values.'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Thompson',
      role: 'Co-Founder & CEO',
      description: 'Literature PhD with 20+ years in publishing',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfBgthbf9ow1iQXaApN2wka5NlVtKly6JFyw&s'
    },
    {
      name: 'Michael Thompson',
      role: 'Co-Founder & CTO',
      description: 'Former librarian turned tech entrepreneur',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Curation',
      description: 'Award-winning book critic and curator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (

    <div className="about-us-page">
      <UserNav />

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">CloudBook</h1>
            <p className="hero-subtitle">Where Stories Come to Life</p>
            <Link to='/user/homepage/product'>
              <button className="btn btn-custom btn-outline-custom">
                Explore Our Collection
              </button>
            </Link>
          </div>
        </div>
      </section>


      <section className="story-section">
        <div className="container">
          <h2 className="section-title">Our Story</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="story-card">
                <p className="story-text">
                  Founded in 1985 by literature enthusiasts Sarah and Michael Thompson, cloudbook began as a small independent bookstore in the heart of downtown. What started as a dream to create a haven for book lovers has grown into a thriving online community that serves readers across the globe.
                </p>
                <p className="story-text">
                  Our passion for connecting readers with extraordinary stories has driven us to carefully curate one of the most diverse and thoughtful collections available online. From timeless classics to emerging voices, from bestsellers to hidden gems, we believe every reader deserves to find their perfect next read.
                </p>
                <p className="story-text">
                  Today, we're proud to be more than just a bookstore – we're a community of storytellers, dreamers, and book lovers who understand that the right book at the right time can change everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="value-card">
                  <span className="value-icon">{value.icon}</span>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2 className="section-title text-black">By the Numbers</h2>
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="stat-item">
                  <span className={`stat-number ${animateStats ? 'animate-counter' : ''}`}>
                    {stat.number}
                  </span>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="team-card">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="quote-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <p className="quote-text">
                A room without books is like a body without a soul
              </p>
              <p className="quote-author">— Marcus Tullius Cicero</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Start Your Next Chapter</h2>
          <p className="cta-text">
            Join thousands of readers who have discovered their next favorite book with us.
            Explore our curated collection and find stories that will inspire, challenge, and delight you.
          </p>
        
            <div className="cta-buttons">
              <Link to='/user/homepage/product'>
              <button className="btn btn-custom btn-primary-custom">
                Browse Books
              </button> 
              </Link>
               <Link to='/user/subscribe'>
              <button className="btn btn-custom btn-outline-custom">
                Join Our Newsletter
              </button>
               </Link>
            </div>
         
        </div>
      </section>
      <UserFooter />
    </div>
  );
};

export default AboutUs;