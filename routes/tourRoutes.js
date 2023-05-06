/* eslint-disable import/extensions */
const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');
const reviewRouter = require('./reviewRoutes');
const bookingsRouter = require('./bookingRoutes');

const router = express.Router();

// val parameter is hold value of the id parameter
// par middleware
// router.param('id', tourController.checkID);

// 3) ROUTE

// To access the reviews resource on the tour's resource => nested route

router.use('/:tourId/reviews', reviewRouter);
router.use('/:tourId/bookings', bookingsRouter);

router
  .route('/top-5-cheap')
  .get(authController.protect, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-distance?distance=233&center=-40,45&unit=mi
// /tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
