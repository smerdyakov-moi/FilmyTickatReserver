const express = require('express');
const router = express.Router();
const {
  createMovie,
  deleteMovieTime,
  addMovieTime,
  getAllMovies,
  reserveTicket,
  getUserReservations,
  updateTicket,
} = require('../controllers/movieController');

const { isLoggedin, isAdmin } = require('../middlewares/authMiddleware');

router.post('/moviecreate', isAdmin, createMovie);
router.delete('/deletemovieTime', isAdmin, deleteMovieTime);
router.post('/addmovieTime', isAdmin, addMovieTime);

router.get('/allmovies', isLoggedin, getAllMovies);
router.post('/reserveticket', isLoggedin, reserveTicket);

router.get('/yourreservations', isLoggedin, getUserReservations);
router.patch('/updateticket', isLoggedin, updateTicket);

module.exports = router;
