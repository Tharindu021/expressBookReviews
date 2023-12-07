const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const { username, password } = req.query;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    // If everything is okay, add the new user
    const newUser = { username, password };
    users.push(newUser);

    res.status(201).json({ message: 'Customer Succesfully registerd,you can log in now.'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});
// //using promise
// const getBooksPromise = () => {
//   return new Promise((resolve, reject) => {
//     axios.get('http://localhost:5000') 
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// };

// getBooksPromise()
//   .then(books => {
//     console.log('List of books:', books);
//   })
//   .catch(error => {
//     console.error('Error:', error.toString());
//   });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookData = books[isbn];

    if (bookData) {
        res.send(JSON.stringify(bookData));
    } else {
        res.status(404).send('Book not found');
    }
 });
////using promise 
// const getBookDetailsPromise = (isbn) => {
//   return new Promise((resolve, reject) => {
//     axios.get(`http://localhost:5000/isbn/${isbn}`) 
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// };

// getBookDetailsPromise(isbn)
//   .then(book => {
//     console.log('Book details:', book);
//   })
//   .catch(error => {
//     console.error('Error:', error.toString());
//   });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authors = req.params.author;
    const book_details = Object.values(books);
    const bookData = book_details.filter((book)=>book.author === authors);

    if (bookData.length > 0) {
        const output = {
            booksbyauthor: bookData.map((book) => {
                return {
                     // i havent isbn propert in the objects
                     isbn: Object.keys(books).find(key => books[key] === book),
                    title: book.title,
                    reviews: book.review  || {} // Assuming you have a reviews property in your book objects
                };
            })
        };

        res.send(output);
    } else {
        res.status(404).send('Books not found for the given author');
    }
});
// ////using promise 
// const getBookDetailsPromise = (author) => {
//   return new Promise((resolve, reject) => {
//     axios.get(`http://localhost:5000/author/${author}`) 
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// };

// getBookDetailsPromise(author)
//   .then(book => {
//     console.log('Book details:', book);
//   })
//   .catch(error => {
//     console.error('Error:', error.toString());
//   });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titles = req.params.title;
    const book_details = Object.values(books);
    const bookData = book_details.filter((book)=>book.title === titles);

    if (bookData.length > 0) {
        const output = {
            booksbytitle: bookData.map((book) => {
                return {
                     // i havent isbn propert in the objects
                     isbn: Object.keys(books).find(key => books[key] === book),
                    author: book.author,
                    reviews: book.reviews || {} // Assuming you have a reviews property in your book objects
                };
            })
        };

        res.send(output);
    } else {
        res.status(404).send('Books not found for the given title');
    }
});
// ////using promise 
// const getBookDetailsPromise = (title) => {
//   return new Promise((resolve, reject) => {
//     axios.get(`http://localhost:5000/title/${title}`) 
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// };

// getBookDetailsPromise(title)
//   .then(book => {
//     console.log('Book details:', book);
//   })
//   .catch(error => {
//     console.error('Error:', error.toString());
//   });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookData = books[isbn];

  if (bookData) {
      res.send(bookData.review || {});
  } else {
      res.status(404).send('Books not found for the given isbn');
  }
});

module.exports.general = public_users;
