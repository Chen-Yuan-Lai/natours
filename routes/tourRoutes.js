/* eslint-disable import/extensions */
const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

// val parameter is hold value of the id parameter
// par middleware
// router.param('id', tourController.checkID);

// 3) ROUTE
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
