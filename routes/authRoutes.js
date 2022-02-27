const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { getMe, authenticateUser } = require('../controllers/authController');


router.get('/', auth, getMe);
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  authenticateUser
);

module.exports = router;
