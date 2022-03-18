const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const { getMe, authenticateUser } = require('../controllers/authController');


router.get('/', protect, getMe);
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  authenticateUser
);

module.exports = router;
