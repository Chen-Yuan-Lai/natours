const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using data from 1)
  res.status(200).render('overview', {
    title: 'All tour',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build template
  // 3) Render that template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  // 1) Build template

  // 2) Render that template
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your acconut',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  console.log(bookings);
  // 2) find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({
    // select all the tours which havw an ID which is in the tourIDs array
    _id: { $in: tourIDs },
  });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

exports.getCheckoutForm = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug });
  res.status(200).render('DropIn', {
    title: 'Checkout',
    tour,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true, // get new document
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your acconut',
    user: updatedUser,
  });
});
