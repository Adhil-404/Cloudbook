import React, { useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Adminstyles/AdminAddbook.css'
import { useNavigate } from 'react-router-dom';

function AdminAddbook() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',                         
    description: '',
    price: '',
    
  });
 const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState(null); 

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]); 
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', book.title);
  formData.append('author', book.author);
  formData.append('category', book.category);
  formData.append('description', book.description);
  formData.append('price', book.price);
  formData.append('coverImage', coverImage); 

  try {
    const token = localStorage.getItem("adminToken");
    
    await axios.post('http://localhost:5000/api/addbook', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Book added successfully!");
    setBook({
      title: '',
      author: '',
      category: '',
      description: '',
      price: '',
    });
    setCoverImage(null);
    navigate('/admin/dashboard');
  } catch (err) {
    console.error("Error adding book:", err);
    alert("Failed to add book, please try again.");
  }
};

  return (
    <div className="add-book-form">
       <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <span className="logout-link" onClick={() => navigate('/admin/dashboard')}>
          <i className="bi bi-arrow-left-circle"></i> Back to Dashboard
        </span>
      </div>
      <h2>Add a New Book</h2>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={book.category} onChange={handleChange} required />
        <input type="text" name="price" placeholder="Price" value={book.price} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        
        <textarea name="description" placeholder="Description" value={book.description} onChange={handleChange} required />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AdminAddbook;
