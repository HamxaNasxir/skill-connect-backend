// Packages:
// By default imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Static Imports
require("dotenv").config();
const database = require("./database/index.js");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares.js");
const {socketServer} = require("./socketapi")

// Routes Import
// By default router Imports
var indexRouter = require('./routes/index');

// Static imports of routes
const userModule = require("./user");
const profileModule = require('./profile');
const chatModule = require("./chat");
const notificationModule = require("./notification");

var app = express();
const server = require("http").createServer(app);
socketServer(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
  origin: '*', // Replace with your frontend's URL
  credentials: true, // Enable credentials (cookies, authorization headers)
};

// Middlewares
app.use(logger('dev'));
app.use(express.json({limit: '10gb'}));
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: '10gb', extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, 'public')));


// Giving routers access
app.use('/', indexRouter);
app.use('/users', userModule);
app.use('/profiles', profileModule);
app.use('/chats', chatModule);
app.use('/notifications', notificationModule);

app.options('*', cors(corsOptions));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (Note: This should be after your route handlers and 404 handler)
app.use(errorHandler); // Place errorHandler before notFound

// Middleware for handling 404 errors (Note: This should be after the error handler)
app.use(notFound);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  try {
    database(); // Wait for the database connection to be established
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
});

module.exports = app;
