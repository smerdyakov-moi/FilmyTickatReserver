const movieModel = require('../models/movieModel');
const userModel = require('../models/userModel');

const createMovie = async (req, res) => {
  const { name, seats, runtime, showtime } = req.body;
  try {
    await movieModel.create({ name, seats, runtime, showtime });
    res.send('Movie added successfully');
  } catch (err) {
    console.error(err);
    res.status(403).send('Unable to add the movie');
  }
};

const deleteMovieTime = async (req, res) => {
  const { movie_name, time } = req.body;
  const movie = await movieModel.findOne({ name: movie_name });
  if (!movie) return res.status(404).send('Movie not found');

  movie.showtime = movie.showtime.filter((element) => element.time !== time);
  await movie.save();
  res.send('Showtime deleted successfully');
};

const addMovieTime = async (req, res) => {
  const { movie_name, time, seats } = req.body;
  const movie = await movieModel.findOne({ name: movie_name });
  if (!movie) return res.status(404).send('Movie not found');

  movie.showtime.push({ time, seats });
  await movie.save();
  res.send('Showtime added successfully');
};

const getAllMovies = async (req, res) => {
  const movies = await movieModel.find();
  res.send(movies);
};

const reserveTicket = async (req, res) => {
  const { name, timex, seat } = req.body;
  const user = await userModel.findOne({ _id: req.user.userid });
  const movie = await movieModel.findOne({ name });
  if (!movie) return res.status(404).send('Movie not found');

  const index = movie.showtime.findIndex((element) => element.time === timex);
  if (index === -1) return res.status(403).send('No such time for the film');
  if (movie.showtime[index].seats - seat < 0) {
    return res.status(401).send('No more tickets for this time. Check other timings please !!!');
  }

  user.bookeds.push({
    movie: movie._id,
    time: timex,
    ticket: seat,
  });
  await user.save();

  movie.showtime[index].seats -= seat;
  movie.showtime[index].bookedby.push(user._id);
  await movie.save();

  res.send(`${seat} ticket${seat > 1 ? 's' : ''} reserved successfully at ${timex} for the film ${name}`);
};

const getUserReservations = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user.userid }).populate('bookeds.movie');
  if (!user || user.bookeds.length === 0) return res.send('You have no bookings.');

  const reservations = user.bookeds.map((booked) => {
    return `You have ${booked.ticket} ticket${booked.ticket > 1 ? 's' : ''} for ${booked.movie.name} at ${booked.time}`;
  });

  res.send(reservations.join('\n'));
};

const updateTicket = async (req, res) => {
  let user = await userModel.findOne({ _id: req.user.userid }).populate('bookeds.movie');
  if (user.bookeds.length === 0) return res.send('You have no reservations to update');

  let { name, time, seat, action } = req.body;
  let found = false;

  try {
    for (let i = 0; i < user.bookeds.length; i++) {
      let booked = user.bookeds[i];
      if (booked.movie.name === name && booked.time === time) {
        found = true;

        let show = booked.movie.showtime.find((s) => s.time === time);
        if (!show) return res.status(404).send('Showtime not found');

        if (action === 'add') {
          booked.ticket += seat;
          show.seats -= seat;
          if (show.seats < 0) return res.status(404).send('Not enough seats for booking');
          await booked.movie.save();
          await user.save();
          return res.send('Tickets added successfully');
        } else if (action === 'subtract') {
          booked.ticket -= seat;
          if (booked.ticket < 0)
            return res.status(404).send("You haven't booked that many tickets to subtract.");
          show.seats += seat;
          await booked.movie.save();
          await user.save();
          return res.send('Tickets reduced successfully');
        } else {
          user.bookeds.splice(i, 1);
          show.bookedby = show.bookedby.filter((uid) => uid.toString() !== user._id.toString());
          show.seats += booked.ticket;
          await booked.movie.save();
          await user.save();
          return res.send('Reservation cancelled');
        }
      }
    }
    if (!found) return res.status(404).send('Matching reservation not found');
  } catch (err) {
    console.error(err);
    res.status(401).send('Error processing update info');
  }
};

module.exports = {
  createMovie,
  deleteMovieTime,
  addMovieTime,
  getAllMovies,
  reserveTicket,
  getUserReservations,
  updateTicket,
};
