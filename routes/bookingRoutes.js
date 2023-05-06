const express = require('express');
const bookingController = require('../controllers/bookingControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.use(authController.protect);

// router.get('/checkout-session/:tourId', bookingController.createOrder);

router.get('/client_token', bookingController.createClientToken);

router.post('/checkout', bookingController.createTransaction);

// router.get('/cpature/:orderId', bookingController.capturePayment);

module.exports = router;
