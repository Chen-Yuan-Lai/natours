const express = require('express');
const tourController = require('./../controllers/tourControllers.js');
const router = express.Router();

// val parameter is hold value of the id parameter
router.param('id', tourController.checkID);
// 3) ROUTE
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
