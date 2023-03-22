const express = require('express');
const tourController = require('./../controllers/tourControllers.js');
const router = express.Router();

// val parameter is hold value of the id parameter
// par middleware
router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

// 3) ROUTE
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.checkID);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
