
const Book = require('../Schema/BookSchema');

const addBook = async (req, res) => {
  try {
    const { title, author, category, description, price } = req.body;
   
  if (!title || !author || !category || !description || !price || !req.file) {
    return res.status(400).json({ message: "All fields are required." });
  }
    const coverImage = req.file.filename; 
    const newBook = new Book({
      title,
      author,
      category,
      description,
      price,
      coverImage
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });

  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.coverImage = req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json({ message: 'Book updated', updatedBook });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addBook,
  deleteBook,
  getBookById,
  updateBook,
  getSingleBook,
};
