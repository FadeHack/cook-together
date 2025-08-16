const httpStatus = require('http-status');
const { User, Recipe } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.username && await User.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by email
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, user.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.username && (await User.isUsernameTaken(updateBody.username, user.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  await User.updateOne(
    { email },
    { $set: updateBody }
  );

  const updatedUser = await getUserByEmail(email);
  return updatedUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

/**
 * Get user with populated role details
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserWithRoleDetails = async (userId) => {
  const user = await User.findById(userId).populate('roleDetails');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Add a recipe to a user's saved list
 * @param {ObjectId} userId
 * @param {ObjectId} recipeId
 * @returns {Promise<User>}
 */
const saveRecipe = async (userId, recipeId) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Using $addToSet is robust: it adds the recipeId only if it's not already in the array.
  return User.findByIdAndUpdate(userId, { $addToSet: { saved_recipes: recipeId } }, { new: true });
};

/**
 * Remove a recipe from a user's saved list
 * @param {ObjectId} userId
 * @param {ObjectId} recipeId
 * @returns {Promise<User>}
 */
const unsaveRecipe = async (userId, recipeId) => {
  // Using $pull will remove all instances of recipeId from the array.
  return User.findByIdAndUpdate(userId, { $pull: { saved_recipes: recipeId } }, { new: true });
};

/**
 * Get a user's saved recipes with pagination
 * @param {ObjectId} userId
 * @param {Object} options - Query options for pagination
 * @returns {Promise<QueryResult>}
 */
const getSavedRecipes = async (userId, options) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // We find all Recipes whose _id is in the user's saved_recipes array
  const filter = {
    _id: { $in: user.saved_recipes },
  };

  return Recipe.paginate(filter, options);
};

/**
 * Get recipes created by a user with pagination
 * @param {ObjectId} userId
 * @param {Object} options - Query options for pagination
 * @returns {Promise<QueryResult>}
 */
const getMyRecipes = async (userId, options) => {
  // This is the core logic: we create a filter to find recipes
  // where the 'author' field matches the user's ID.
  const filter = {
    author: userId,
  };

  // We can then pass this filter directly to the generic Recipe.paginate method.
  return Recipe.paginate(filter, options);
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  deleteUserById,
  updateUserByEmail,
  getUserWithRoleDetails,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  getMyRecipes,
};
