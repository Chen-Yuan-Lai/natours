// const fetch = require('node-fetch');
const braintree = require('braintree');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.createClientToken = catchAsync(async (req, res, next) => {
  const clientToken = await gateway.clientToken.generate({});

  res.send(clientToken);
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.body.tourId);
  const nonceFromTheClient = req.body.payment_method_nonce;
  const userName = req.user.name.split(' ');
  const transaction = await gateway.transaction.sale({
    amount: `${tour.price * 100}`,
    paymentMethodNonce: nonceFromTheClient,
    customer: {
      firstName: userName[0],
      lastName: userName[1],
      email: req.user.email,
    },
    options: {
      submitForSettlement: true,
    },
  });

  // reset req.body to fit the requirement of the factory function
  req.body = {
    tour: req.body.tourId,
    user: req.user.id,
    price: tour.price,
  };
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
