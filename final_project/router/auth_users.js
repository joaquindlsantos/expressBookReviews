const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//Check if username is available.
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

//Check if username and password match the one we have in records.
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// TASK 7
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// TASK 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (!isbn || !review || !username) {
    return res.status(400).json({ error: "ISBN, review, and username are required." });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
    } else {
      books[isbn].reviews[username] = review;
    }
    return res.json({ message: "The review for the book with ISBN " + isbn + " has been added/updated." });
  } else {
    return res.status(404).json({ error: "Book not found." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username; // Obtener el nombre de usuario de la sesión

  if (!isbn || !username) {
    return res.status(400).json({ error: "ISBN and username are required." });
  }

  if (books[isbn]) {
    const userReview = books[isbn].reviews[username];

    if (userReview) {
      delete books[isbn].reviews[username]; // Eliminar la reseña del usuario
      return res.json({ message: "Review for the ISBN " + isbn + " posted by the user " + username + " deleted." });
    } else {
      return res.status(404).json({ error: "Review not found for this user and ISBN." });
    }
  } else {
    return res.status(404).json({ error: "Book not found." });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
