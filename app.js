var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/eventsRouter'); // Import events routes
const newsRouter = require('./routes/newsRouter');
const discussionRoutes = require('./routes/discussionRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');



var app = express();

const url = "mongodb://127.0.0.1:27017/moringaconnect";
mongoose.connect(url, {})
  .then(() => console.log("Connected correctly to server"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Add the events API
app.use('/api/events', eventsRouter); 
app.use("/api/news", newsRouter);
app.use('/api/discussions', discussionRoutes);
app.use('/api/mentorship', mentorshipRoutes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
