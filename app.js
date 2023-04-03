const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// 1) MIDDLEWARES
// use middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// Serving static files
app.use(express.static(`${__dirname}/public`));

// 3) Mounting ROUTES
// mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle other routes
app.all('*', (req, res, next) => {
  // if the next function receives an argument, no matter what it is,
  // Express will automatically know that there was an error
  // then skip all the other middlewares in the middleware
  // stack and sent the error that we passed in
  // to our global error handling middleware,
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware
app.use(globalErrorhandler);
module.exports = app;
