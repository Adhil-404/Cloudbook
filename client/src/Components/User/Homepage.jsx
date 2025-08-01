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

  const findBookBy = async (criteria, value, limit = 8) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/findBookBy`, {
        params: { [criteria]: value, limit }
      });
      return res.data;
    } catch (err) {
      console.error(`Error finding books by ${criteria}:`, err);
      return [];
    }
  };

  const findBooksByCategory = async (category, limit = 8) => {
    return await findBookBy('category', category, limit);
  };

  const findFeaturedBooks = async (limit = 8) => {
    return await findBookBy('featured', true, limit);
  };

  const findTrendingBooks = async (limit = 4) => {
    return await findBookBy('trending', true, limit);
  };

  const findBestsellingBooks = async (limit = 4) => {
    return await findBookBy('bestselling', true, limit);
  };

  const findPopularBooks = async (limit = 6) => {
    return await findBookBy('popular', true, limit);
  };

  const findTopSellingBooks = async (limit = 8) => {
    return await findBookBy('topSelling', true, limit);
  };

  const findBooksByStatus = async (status, limit = 8) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/status/${status}?limit=${limit}`);
      return res.data;
    } catch (err) {
      console.error(`Error finding ${status} books:`, err);
      return [];
    }
  };

  const BookCard = ({ book, showPrice = true }) => (
    <div className="book-card">
      <div className="book-image">
        <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
        <div className="book-overlay">
          <Link to={`/product/${book._id}`} className="view-btn">View Details</Link>
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
      {viewAllLink && (
        <Link to={'/user/homepage/product'} className="view-all">View all products →</Link>
      )}
    </div>
  );

  return (
    <div className="homepage">
      <UserNav />

      <section className="hero-section1">
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
                <div className="decorative-book book-7">
                  <div className="book-spine">CLASSICS</div>
                </div>
                <div className="decorative-book book-8">
                  <div className="book-spine">FANTASY</div>
                </div>
                <div className="decorative-book book-9">
                  <div className="book-spine">MYSTERY</div>
                </div>
              </div>
              <div className="book-stack-base"></div>
              <div className="floating-element leaf-1">🍃</div>
              <div className="floating-element leaf-2">🍃</div>
            </div>
          </div>
        </div>
      </section>

      <section className="book-carousel">
        <div className="carousel-container">
          <div className="carousel-track">
            {books.slice(0, 12).map((book) => (
              <div key={book._id} className="carousel-item">
                <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
              </div>
            ))}
            {books.slice(0, 12).map((book) => (
              <div key={`duplicate-${book._id}`} className="carousel-item">
                <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sale-banners">
        <div className="banner-container">
          <div className="sale-banner banner-purple">
            <div className="banner-content">
              <h3>Sale 25% OFF</h3>
              {books[0] && (
                <Link to={`/product/${books[0]._id}`}>
                  <button className="banner-btn">Shop now →</button>
                </Link>
              )}

            </div>
            <div className="banner-image">
              {books[0] && <img src={`http://localhost:5000/uploads/${books[0].coverImage}`} alt="Sale book" />}
            </div>
          </div>
          <div className="sale-banner banner-teal">
            <div className="banner-content">
              <h3>Sale 45% OFF</h3>
              {books[1] && (
                <Link to={`/product/${books[1]._id}`}>
                  <button className="banner-btn">Shop now →</button>
                </Link>
              )}

            </div>
            <div className="banner-image">
              {books[1] && <img src={`http://localhost:5000/uploads/${books[1].coverImage}`} alt="Sale book" />}
            </div>
          </div>
        </div>
      </section>

      <section className="top-selling-section">
        <SectionHeader title="Top Selling Vendor" viewAllLink="/vendors" />
        <div className="vendor-grid">
          {books.slice(6, 14).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      <section className="subscription-banner">
        <div className="subscription-content">
          <div className="subscription-text">
            <h3>Only $5.99 a month</h3>
            <button className="subscription-btn" onClick={() => navigate('/user/homepage/product')}>
              Start now
            </button>
          </div>
          <div className="subscription-books">
            {books.slice(2, 5).map((book) => (
              <img
                key={book._id}
                src={`http://localhost:5000/uploads/${book.coverImage}`}
                alt={book.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="favourite-reads">
        <SectionHeader title="Our Favourite Reads" viewAllLink="/favourites" />
        <div className="favourite-grid">
          {books.slice(0, 6).map((book) => (
            <div key={book._id} className="favourite-item">
              <img src={`http://localhost:5000/uploads/${book.coverImage}`} alt={book.title} />
              <div className="favourite-info">
                <h4 className='book_title'>{book.title}</h4>
                <p className='book_author'>Author : {book.author}</p>
                <p className='card-category'>Category : {book.category}</p>  
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

      <section className="trending-section">
        <SectionHeader title="Trending Now" viewAllLink="/trending" />
        <div className="trending-container">
          <div className="trending-books">
            {books.slice(14, 18).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          <div className="trending-banner">
            <div className="discount-badge">30% Off</div>
            <h4>Epic Fantasy Collection</h4>
            <p>Dive into magical worlds</p>
          </div>
        </div>
      </section>

      <section className="bestselling-section">
        <SectionHeader title="Bestselling Books" viewAllLink="/bestselling" />
        <div className="bestselling-container">
          <div className="bestselling-books">
            {books.slice(18, 22).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          <div className="bestselling-banner">
            <div className="discount-badge">25% Off</div>
            <h4>Classic Literature</h4>
            <p>Timeless stories for every reader</p>
          </div>
        </div>
      </section>

      <section className="popular-section">
        <SectionHeader title="Popular Books" viewAllLink="/popular" />
        <div className="books-grid">
          {books.slice(22, 28).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      <UserFooter />
    </div>
  );
}

export default UserHomepage;