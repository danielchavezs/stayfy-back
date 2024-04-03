const axios = require('axios');
require('dotenv').config();
const { API_URL } = process.env;
const { Book } = require('../../db.js');
const { filterByTitle } = require('../filters.js/filterByTitle');
const { filterByGenre } = require('../filters.js/filterByGenre');
const { sortByDate } = require('../filters.js/sortByDate');
const { sortBooks } = require('../filters.js/sortBooks');
const { filterByAuthor } = require('../filters.js/filterByAuthor');
const { filterByPublisher } = require('../filters.js/filterByPublisher');
const { filterByRating } = require('../filters.js/filterByRating');
const { activeFilter } = require('../filters.js/activeFilter');
const { DEFAULT_IMAGE } = require('../../utils');

const createBooks = async () => {

  const response = await fetch(`${API_URL}`)
  const data = await response.json()
  const dbBooks = await Book.findAll();

  if (dbBooks.length < 1) {
      data.books.forEach(async (book) => {
        await Book.create({
          id: book.id,
          title: book.title,
          authors: book.authors,
          publisher: book.publisher,
          image: book.image ? book.image : DEFAULT_IMAGE,
          publishedDate: book.publishedDate,
          pageCount: book.pageCount,
          genre: book.gender,
          price: Math.ceil(book.price),
          description: book.description,
          rating: Math.round(Math.random() * (5 - 2) + 2),
          stock: Math.round(Math.random () * (100 - 0) + 0),
        });
      });
    };
  };

const getBooks = async () => {
  const dbBooks = await Book.findAll();
  return dbBooks;
};

const getFilteredBooks = async ({ sort, page = 0, genre = '', title, publishedDate, author, publisher, rating }) => {

  let foundBooks = await getBooks();

  foundBooks = activeFilter(foundBooks);
  foundBooks = filterByTitle(foundBooks, title);
  foundBooks = filterByGenre(foundBooks, genre);
  foundBooks = filterByAuthor(foundBooks, author);
  foundBooks = filterByPublisher(foundBooks, publisher);
  foundBooks = filterByRating(foundBooks, rating);

  if(publishedDate){
    foundBooks = sortByDate(foundBooks, publishedDate);
  };
  const sortedBooks = sortBooks(foundBooks, sort, page);
  return sortedBooks;
};

module.exports = { createBooks, getBooks, getFilteredBooks };