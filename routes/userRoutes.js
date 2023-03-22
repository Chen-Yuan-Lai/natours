const express = require('express');
const userController = require('./../controllers/userControllers.js');
const router = express.Router();
// 3) ROUTE
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
