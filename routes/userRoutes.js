const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();
// ROUTE
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// REST format
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
