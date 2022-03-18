const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const gravatar = require('gravatar');
const config = require('config');
const normalize = require('normalize-url');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');




// @route    POST api/users
// @desc     Register user
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructurize
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Set avatar
  const avatar = normalize(
    gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    }),
    { forceHttps: true }
  );

  // Create user
  const user = await User.create({
    name,
    email,
    avatar,
    password: hashedPassword
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
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
  registerUser
};