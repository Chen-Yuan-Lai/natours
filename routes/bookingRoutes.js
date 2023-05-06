const express = require('express');
const bookingController = require('../controllers/bookingControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.use(authController.protect);

// router.get('/checkout-session/:tourId', bookingController.createOrder);

router.get('/client_token', bookingController.createClientToken);

router.post(
  '/checkout',
  bookingController.createTransaction,
  bookingController.createBooking
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// router.get('/cpature/:orderId', bookingController.capturePayment);

module.exports = router;
