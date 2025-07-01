const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const { addBook , deleteBook } = require("../Controllers/BookController");
const { getBookById, updateBook } = require('../Controllers/BookController');

router.post('/addbook', upload.single('coverImage'), addBook); 
router.get('/allbooks', async (req, res) => {
  const Book = require('../Schema/BookSchema');
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.get('/test', (req, res) => {
  res.send('API is working!');
});

router.delete('/deletebook/:id', deleteBook);
router.get('/book/:id', getBookById);
router.put('/updatebook/:id', upload.single('coverImage'), updateBook);

module.exports = router;
