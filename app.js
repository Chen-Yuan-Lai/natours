const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// Further HELMET configuration for Security Policy (CSP)

const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://*.cloudflare.com',
  'https://js.braintreegateway.com/',
  'https://code.jquery.com/',
  // 'https://www.paypal.com/',
  // 'https://www.sandbox.paypal.com/',
  // 'https://js.stripe.com/v3/',
  // 'https://checkout.stripe.com',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://www.myfonts.com/fonts/radomir-tinkov/gilroy/*',
  'https://assets.braintreegateway.com/',
  // 'https://www.paypalobjects.com/',
  // ' checkout.stripe.com',
];
const connectSrcUrls = [
  'https://*.mapbox.com/',
  'https://*.cloudflare.com',
  'https://payments.sandbox.braintree-api.com/',
  'https://api.sandbox.braintreegateway.com/',
  'https://origin-analytics-sand.sandbox.braintree-api.com/',
  // 'https://www.sandbox.paypal.com/',
  // 'http://127.0.0.1:8000',
  // 'http://127.0.0.1:52191',
  // '*.stripe.com',
];

const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      // objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https://www.paypalobjects.com/'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ['https://assets.braintreegateway.com/'],
    },
  })
);

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  // 100 request per hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// limit: restrict body size
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// Look at the request body, the request query string,
// and also at Request.Params, and then it will basically filter out
// all of the dollar signs and dots,
app.use(mongoSanitize());
// Data sanitization against XSS
// prevent that basically by converting all these HTML symbols.
app.use(xss());

// Prevent parameter pollution
// white list is simply an array of properties
// for which we actually allow duplicates in the query string.
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuanity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});

// 3) Mounting ROUTES
// mounting the router
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// handle other routes
app.all('*', (req, res, next) => {
  // if the next function receives an argument, no matter what it is,
  // Express will automatically know that there was an error
  // then skip all the other middlewares in the middleware
  // stack and sent the error that we passed in
  // to our global error handling middleware,
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// when there is an error happened in express, it
// will automatically go to the error-handling middleware
// with that error

// error handling middleware
app.use(globalErrorhandler);
module.exports = app;
