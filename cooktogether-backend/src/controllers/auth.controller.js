const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, roleService, emailService } = require('../services');
const admin = require('../config/firebase');
const { defaultRole } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const { idToken, username } = req.body;
  
  // Verify the Firebase ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;
  
  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  
  // Get role details
  const roleDetails = await roleService.getRoleDetailsByName(defaultRole);
  
  // Create user in our database
  const userCreateBody = { 
    email, 
    username,
    role: defaultRole,
    roleDetails: roleDetails._id,
    firebaseUid: decodedToken.uid,
    emailVerified: decodedToken.email_verified || false,
  };
  
  const user = await userService.createUser(userCreateBody);
  
  // Send welcome email
  // await emailService.sendWelcomeEmail(email, username);
  
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  
  // Verify the Firebase ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;
  
  // Get user from database
  const user = await userService.getUserByEmail(email);
  
  if (!user) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
    return;
  }
  
  res.send({ user });
});

const userPreference = catchAsync(async (req, res) => {
  const userPreference = req.body;
  const updatedUser = await userService.updateUserByEmail(req.user.email, userPreference);
  res.send({ user: updatedUser });
});

/**
 * Get the current authenticated user
 * This endpoint relies on the auth middleware to verify the token
 * and attach the user to the request object
 */
const getCurrentUser = catchAsync(async (req, res) => {
  // req.user and req.firebaseUser are now set by our updated auth middleware.
  let user = req.user;

  // KEY CHANGE: If user doesn't exist in our DB, create them.
  if (!user) {
    const { email, uid, email_verified } = req.firebaseUser;
    
    // You might want a default username generation scheme
    const username = email.split('@')[0];
    
    const roleDetails = await roleService.getRoleDetailsByName(defaultRole);

    const userCreateBody = {
      email,
      username, // Note: This might collide. A better approach might prompt the user for a username on first login.
      role: defaultRole,
      roleDetails: roleDetails._id,
      firebaseUid: uid,
      emailVerified: email_verified || false,
    };
    
    user = await userService.createUser(userCreateBody);
  }

  // By this point, we are guaranteed to have a user object, either found or newly created.
  res.send({ user });
});

module.exports = {
  register,
  login,
  userPreference,
  getCurrentUser
};
