const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TASK 6
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      console.log(users);
      return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

// // TASK 1 without ASYNC
/*
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});
*/
// TASK 1 with ASYNC
public_users.get('/', async (req, res) => {
  try {
    // Puedes usar los datos locales directamente
    return res.json(books); // Devolver la lista de libros al cliente
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching book list.' });
  }
});

// TASK 2 without async
/*
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  return res.send(JSON.stringify(books[ISBN], null, 4));
});
*/
//TASK 2 with ASYNC
public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;
  try {
    const bookDetails = books[ISBN];

    if (bookDetails) {
      return res.json(bookDetails);
    } else {
      return res.status(404).json({ error: 'Book not found.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching book details.' });
  }
});

// TASK 3 without ASYNC
/*
public_users.get('/author/:author', function (req, res) {
  const requestedAuthor = req.params.author;
  const matchingBooks = [];
  for (const key in books) {
    if (books[key].author === requestedAuthor) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }
  if (matchingBooks.length > 0) {
    return res.json({ booksbyauthor: matchingBooks });
  }
  else {
    res.status(404).json({ error: 'No books found for the requested author' });
  }
});
*/
// TASK 3 with ASYNC
public_users.get('/author/:author', async (req, res) => {
  const requestedAuthor = req.params.author;
  const matchingBooks = [];

  try {
    for (const key in books) {
      if (books[key].author === requestedAuthor) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }

    if (matchingBooks.length > 0) {
      return res.json({ booksbyauthor: matchingBooks });
    } else {
      return res.status(404).json({ error: 'No books found for the requested author' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching book details by author.' });
  }
});

// TASK 4 without ASYNC
/*
public_users.get('/title/:title', function (req, res) {
  const requestedTitle = req.params.title;
  const matchingBooks = [];
  for (const key in books) {
    if (books[key].title === requestedTitle) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }
  if (matchingBooks.length > 0) {
    return res.json({ booksbytitle: matchingBooks });
  }
});
*/
// TASK 4 with ASYNC
public_users.get('/title/:title', async (req, res) => {
  const requestedTitle = req.params.title;
  const matchingBooks = [];

  try {
    for (const key in books) {
      if (books[key].title === requestedTitle) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    }

    if (matchingBooks.length > 0) {
      return res.json({ booksbytitle: matchingBooks });
    } else {
      return res.status(404).json({ error: 'No books found for the requested title' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching book details by title.' });
  }
});

// TASK 5
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  return res.send(JSON.stringify(books[ISBN].reviews, null, 4));
});

module.exports.general = public_users;
