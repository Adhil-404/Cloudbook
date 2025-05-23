import React from 'react'
import "../../Assets/Styles/Userstyles/Homepage.css"
import UserNav from './UserNav';

function Homepage() {

  const categories = [
    "Fiction",
    "Non-fiction",
    "Children",
    "Academic",
    "Self-Help",
    "Mystery",
  ];

  const bestsellers = [
    { title: "Atomic Habits", price: "$16.99" },
    { title: "Where the Crawdads Sing", price: "$14.49" },
    { title: "Becoming", price: "$22.99" },
  ];
  return (

    <div className="homepage-container">

      <UserNav />
  
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Favorite Book</h1>
          <p>Curated reads for every genre and reader</p>
          <button>Browse Collection</button>
        </div>
      </section>

      <section className="section categories">
        <h2> Categories</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat} className="category-card">
              {cat}
            </div>
          ))}
        </div>
      </section>


      <section className="section bestsellers">
        <h2> Bestsellers</h2>
        <div className="bestseller-grid">
          {bestsellers.map((book) => (
            <div key={book.title} className="bestseller-card">
              <h3>{book.title}</h3>
              <p>{book.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>


      <footer className="homepage-footer">
        &copy; 2025 BookNest. All rights reserved.
      </footer>
    </div>

  )
}

export default Homepage