/* eslint-disable import/extensions */
const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// val parameter is hold value of the id parameter
// par middleware
// router.param('id', tourController.checkID);

// 3) ROUTE

// To access the reviews resource on the tour's resource => nested route

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(authController.protect, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
