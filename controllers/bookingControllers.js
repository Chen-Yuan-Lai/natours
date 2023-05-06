// const fetch = require('node-fetch');
const braintree = require('braintree');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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

  res.status(200).json({
    status: 'success',
    data: transaction,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  await Booking.create({
    tour: req.body.tourId,
    user: req.user.id,
    price: tour.price,
  });
});
exports.getAllBooking = catchAsync(async (req, res, next) => {});
exports.getBooking = catchAsync(async (req, res, next) => {});
exports.getBooking = catchAsync(async (req, res, next) => {});
