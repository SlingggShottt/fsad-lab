const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    { id: 3, title: 'Book 3', author: 'Author 3' }
];

console.log('Inside the booksrep.js file');
function getBooks() {
return books;
}

function addBook(id,title,author) {
const book = { "id": id, "title": title, "author": author };
books.push(book);
}

function deleteBook(id) {
const index = books.findIndex(book => book.id === id);
if (index !== -1) {
books.splice(index, 1);
}
}

function updateBook(id, updatedBook) {
const index = books.findIndex(book => book.id === id);
if (index !== -1) {
books[index] = { ...books[index], ...updatedBook };
}
}

module.exports = { getBooks, addBook, deleteBook, updateBook };
