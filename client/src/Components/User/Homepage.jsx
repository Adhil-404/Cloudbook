import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UserNav from '../User/Usernav';
import UserFooter from './UserFooter';
import '../../Assets/Styles/Userstyles/Homepage.css';

function UserHomepage() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/allbooks');
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  const BookCard = ({ book, showPrice = true }) => (
    <div className="book-card">
      <div className="book-image">
        <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
        <div className="book-overlay">
          <Link to={`/book/${book._id}`} className="view-btn">View Details</Link>
        </div>
      </div>
      <div className="book-info">
        <h4>{book.title}</h4>
        <p className="author">{book.author}</p>
        {showPrice && <p className="price">₹{book.price}</p>}
      </div>
    </div>
  );

  const SectionHeader = ({ title, viewAllLink }) => (
    <div className="section-header">
      <h2>{title}</h2>
      {viewAllLink && <Link to={viewAllLink} className="view-all">View all products →</Link>}
    </div>
  );

  // Derived sections
  const featuredBooks = books.slice(0, 8);
  const topSellingBooks = books.slice(8, 16);
  const trendingBooks = books.slice(16, 20);
  const bestsellingBooks = books.slice(20, 24);
  const popularBooks = books.slice(24, 28);

  return (
    <div className="homepage">
      <UserNav />

      <div className="homepage-inner">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <div className="special-offer">SPECIAL OFFER</div>
              <h1>There is nothing better than to read</h1>
              <p>Find the perfect gift for everyone on your list.</p>
              <button className="shop-now-btn" onClick={() => navigate('/user/homepage/product')}>
                Shop now →
              </button>
            </div>
            <div className="hero-image">
              <div className="book-stack">
                <div className="floating-books">
                  {books.slice(0, 6).map((book, index) => (
                    <img
                      key={book._id}
                      src={`http://localhost:5000/uploads/${book.coverImage}`}
                      alt={book.title}
                      className={`floating-book book-${index + 1}`}
                    />
                  ))}
                  <div className="decorative-book book-7"><div className="book-spine">CLASSICS</div></div>
                  <div className="decorative-book book-8"><div className="book-spine">FANTASY</div></div>
                  <div className="decorative-book book-9"><div className="book-spine">MYSTERY</div></div>
                </div>
                <div className="book-stack-base"></div>
                <div className="floating-element leaf-1">🍃</div>
                <div className="floating-element leaf-2">📄</div>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel */}
        <section className="book-carousel">
          <div className="carousel-container">
            <div className="carousel-track">
              {featuredBooks.map(book => (
                <div key={book._id} className="carousel-item">
                  <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sale Banners */}
        <section className="sale-banners">
          <div className="banner-container">
            <div className="sale-banner banner-purple">
              <div className="banner-content">
                <h3>Sale 25% OFF</h3>
                <button className="banner-btn">Shop now →</button>
              </div>
              <div className="banner-image">
                {books[0] && <img src={`http://localhost:5000/uploads/${books[0].coverImage}`} alt="Sale book" />}
              </div>
            </div>
            <div className="sale-banner banner-teal">
              <div className="banner-content">
                <h3>Sale 45% OFF</h3>
                <button className="banner-btn">Shop now →</button>
              </div>
              <div className="banner-image">
                {books[1] && <img src={`http://localhost:5000/uploads/${books[1].coverImage}`} alt="Sale book" />}
              </div>
            </div>
          </div>
        </section>

        {/* Top Selling Section */}
        <section className="top-selling-section">
          <SectionHeader title="Top Selling Vendor" viewAllLink="/vendors" />
          <div className="vendor-grid">
            {topSellingBooks.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        </section>

        {/* Subscription */}
        <section className="subscription-banner">
          <div className="subscription-content">
            <div className="subscription-text">
              <h3>Only $5.99 a month</h3>
              <button className="subscription-btn">Start now →</button>
            </div>
            <div className="subscription-books">
              {books.slice(2, 5).map(book => (
                <img key={book._id} src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
              ))}
            </div>
          </div>
        </section>

        {/* Favourite Reads */}
        <section className="favourite-reads">
          <SectionHeader title="Our Favourite Reads" viewAllLink="/favourites" />
          <div className="favourite-grid">
            {books.map(book => (
              <div key={book._id} className="favourite-item">
                <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
                <div className="favourite-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <div className="rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">(4.5)</span>
                  </div>
                  <p className="price">₹{book.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="trending-section">
          <SectionHeader title="Trending Now" viewAllLink="/trending" />
          <div className="trending-container">
            <div className="trending-books">
              {trendingBooks.map(book => <BookCard key={book._id} book={book} />)}
            </div>
            <div className="trending-banner">
              <div className="discount-badge">30% Off</div>
              <h4>Epic Fantasy Collection</h4>
              <p>Dive into magical worlds</p>
            </div>
          </div>
        </section>

        {/* Bestselling */}
        <section className="bestselling-section">
          <SectionHeader title="Bestselling Books" viewAllLink="/bestselling" />
          <div className="bestselling-container">
            <div className="bestselling-books">
              {bestsellingBooks.map(book => <BookCard key={book._id} book={book} />)}
            </div>
            <div className="bestselling-banner">
              <div className="discount-badge">25% Off</div>
              <h4>Classic Literature</h4>
              <p>Timeless stories for every reader</p>
            </div>
          </div>
        </section>

        {/* Popular */}
        <section className="popular-section">
          <SectionHeader title="Popular Books" viewAllLink="/popular" />
          <div className="popular-container">
            <div className="popular-books">
              {popularBooks.map(book => <BookCard key={book._id} book={book} />)}
            </div>
            <div className="monthly-picks-banner">
              <h4>Our Monthly Picks!</h4>
              <p>Curated selection just for you</p>
              <div className="monthly-books">
                {books.slice(0, 3).map(book => (
                  <img key={book._id} src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} className="monthly-book" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="blog-section">
          <SectionHeader title="Latest Blog Post" viewAllLink="/blog" />
          <div className="blog-grid">
            {[0, 1, 2].map(i => (
              books[i] && (
                <article key={i} className="blog-post">
                  <img src={`http://localhost:5000/uploads/${books[i].coverImage}`} alt="Blog post" />
                  <div className="blog-content">
                    <span className="blog-date">March, 2024</span>
                    <h4>Blog Title {i + 1}</h4>
                    <p>Blog excerpt goes here...</p>
                  </div>
                </article>
              )
            ))}
          </div>
        </section>

        <UserFooter />
      </div>
    </div>
  );
}

export default UserHomepage;
