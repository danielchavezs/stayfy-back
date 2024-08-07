const axios = require('axios');
require('dotenv').config();
const { API_URL } = process.env;
const { Book } = require('../../db.js');
const { filterByTitle } = require('../filters/filterByTitle.js');
const { filterByGenre } = require('../filters/filterByGenre.js');
const { sortByDate } = require('../filters/sortByDate.js');
const { sortBooks } = require('../filters/sortBooks.js');
const { filterByAuthor } = require('../filters/filterByAuthor.js');
const { filterByPublisher } = require('../filters/filterByPublisher.js');
const { filterByRating } = require('../filters/filterByRating.js');
const { activeFilter } = require('../filters/activeFilter.js');
const { DEFAULT_IMAGE } = require('../../utils');

const createBooks = async () => {
  console.log(API_URL)
  const apiRequest = axios.get(API_URL);
  const responses = await Promise.all([apiRequest]);
  const dbBooks = await Book.findAll();

  if (dbBooks.length < 1) {
    for (const response of responses) {
      response.data.forEach(async (book) => {
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
          // arsPrice: Math.ceil(book.price * 843),
          // copPrice: Math.ceil(book.price * 4200),
          // mxnPrice: Math.ceil(book.price * 18),
          description: book.description,
          rating: Math.round(Math.random() * (5 - 2) + 2),
          stock: Math.round(Math.random () * (100 - 0) + 0),
        });
      });
    };
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