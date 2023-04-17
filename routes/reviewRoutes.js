const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    // only user can write reviews
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
