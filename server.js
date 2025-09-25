// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// ----- Middleware -----
app.use(express.json()); // Parse JSON bodies
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Log each request
  next();
});

// ----- In-Memory Data -----
let books = [];
let nextId = 1;

// ----- Routes -----

// GET /books - return all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books - return single book based on id 
app.get('/books/:id', (req, res) => {
  res.json(books);
});

// POST /books - add a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;

  // Validate input
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  const newBook = { id: nextId++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - update a book
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// DELETE /books/:id - remove a book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books.splice(index, 1);
  res.json({ message: 'Book deleted successfully' });
});

// ----- Start Server -----
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
