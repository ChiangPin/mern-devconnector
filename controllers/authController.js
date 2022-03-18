const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


// @route    GET api/auth
// @desc     Get user by token
// @access   Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email
  });
});

// @route    POST api/auth
// @desc     Authenticate (login) user & get token
// @access   Public
const authenticateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Compare plain text password from form with user's password
  const isMatch = await bcrypt.compare(password, user.password);

  if (user && isMatch) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid Credentials');
  }
});

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  getMe,
  authenticateUser
};