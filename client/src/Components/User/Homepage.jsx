import React, { useEffect, useState } from 'react';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import axios from 'axios';
import '../../Assets/Styles/Userstyles/Homepage.css'; 

function Homepage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/allbooks')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (bookId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating && rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star">★</span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">★</span>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div>
        <UserNav />
        <div className="homepage-inner">
          <div className="loading-container">
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="loading-card">
                  <div className="loading-image"></div>
                  <div className="loading-title"></div>
                  <div className="loading-text"></div>
                  <div className="loading-text short"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      
      <div className="homepage-inner">
        {/* Hero Section */}
       
        

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-container">
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-controls">
                <div className="category-select-wrapper">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'active' : ''}
                    title="Grid View"
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'active' : ''}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div className="section-header">
            <h2 className="section-title">Featured Books</h2>
            <p className="section-subtitle">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3 className="no-results-title">No books found</h3>
              <p className="no-results-text">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'books-grid' : 'books-list'}>
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className={`book-card ${viewMode === 'list' ? 'book-card-list' : ''}`}
                >
                  <div className={`book-image-container ${viewMode === 'list' ? 'book-image-container-list' : ''}`}>
                    {book.coverImage ? (
                      <img 
                        src={`http://localhost:5000/uploads/${book.coverImage}`} 
                        alt={book.title}
                        className="book-image"
                      />
                    ) : (
                      <div className="book-image-placeholder">
                        📖
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleFavorite(book._id)}
                      className={`favorite-btn ${favorites.has(book._id) ? 'active' : ''}`}
                      title={favorites.has(book._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.has(book._id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="book-content">
                    <div className="book-meta">
                      <span className="book-category">
                        {book.category}
                      </span>
                      <div className="book-rating">
                        {renderStars(book.rating)}
                        <span className="rating-text">
                          ({book.reviews || 0})
                        </span>
                      </div>
                    </div>

                    <h3 className="book-title">
                      {book.title}
                    </h3>
                    
                    <p className="book-author">
                      by {book.author}
                    </p>
                    
                    <p className="book-description">
                      {book.description}
                    </p>
                    
                    <div className="book-footer">
                      <div className="book-price">
                        ₹{book.price}
                      </div>
                      
                      <button className="add-to-cart-btn">
                        <span className="cart-icon">🛒</span>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-subtitle">
              Get notified about new releases, exclusive deals, and reading recommendations
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
}

export default Homepage;