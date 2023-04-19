const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const authController = require('../controllers/authControllers');

// By default,each router only have access to the parameters of their specific routes
// In order to get access to that parameter in this other router,
// we need to physically merge the parameters
const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReviews).post(
  authController.protect,
  // only user can write reviews
  authController.restrictTo('user'),
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
