const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.header('x-auth-token')) {
    try {
      // Get token from header
      token = req.header('x-auth-token');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, exclude hashed password field
      req.user = await User.findById(decoded.id).select('-password');

      // End of middleware, call the next piece of middleware
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }


  // Check if not token
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }
});

module.exports = { protect };