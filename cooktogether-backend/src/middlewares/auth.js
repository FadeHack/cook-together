// src/middlewares/auth.js
const admin = require('../config/firebase');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const auth = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // KEY CHANGE: Find the user, but don't throw an error if not found.
    // We will let the controller handle the logic of what to do.
    const user = await User.findOne({ email: decodedToken.email });

    // Attach both the decoded token and our database user (if found) to the request.
    req.user = user; 
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;