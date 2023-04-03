const express = require('express');
const morgan = require('morgan');
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
  // res.status(404).json({
  //   status: 'faile',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'faile';
  err.statusCode = 404;
  // if the next function receives an argument, no matter what it is,
  // Express will automatically know that there was an error
  // then skip all the other middlewares in the middleware
  // stack and sent the error that we passed in
  // to our global error handling middleware,
  next(err);
});

// error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
