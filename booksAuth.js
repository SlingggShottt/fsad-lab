const express = require('express');
const { getBooks, addBook, deleteBook, updateBook } = require('./booksrep');

const app = express();
const port = 3000;
app.use(express.json());


app.get('/', (req, res) => {
res.status(200).json(getBooks());
});


app.post('/', (req, res) => {
const { id, title, author } = req.body;
addBook({ id, title, author });
res.status(201).json({ message: 'Book added successfully' + JSON.stringify(getBooks()) });
});


app.delete('/:id', (req, res) => {
const id = parseInt(req.params.id);
deleteBook(id);
// Handle delete logic here
res.status(200).json(getBooks());
});


app.put('/:id', (req, res) => {
const id = parseInt(req.params.id);
const updatedBook = req.body;
updateBook(id, updatedBook);
// Handle update logic here
res.status(200).json(getBooks());
});


app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
