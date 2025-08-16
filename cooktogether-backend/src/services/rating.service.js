const httpStatus = require('http-status');
const { Rating } = require('../models');
const { recipeService } = require('./index'); // Use index to prevent circular dependencies
const ApiError = require('../utils/ApiError');

/**
 * Create or update a rating for a recipe.
 * This function handles both new ratings and changes to existing ones.
 * @param {Object} ratingBody
 * @param {string} ratingBody.user - The user's ID
 * @param {string} ratingBody.recipe - The recipe's ID
 * @param {number} ratingBody.rating - The rating value (1-5)
 * @returns {Promise<Rating>}
 */
const createOrUpdateRating = async (ratingBody) => {
  const { user, recipe, rating } = ratingBody;

  // First, verify the recipe exists
  const recipeDoc = await recipeService.getRecipeById(recipe);
  if (!recipeDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Atomically find a rating by user and recipe, and update it.
  // If it doesn't exist, create it (upsert: true).
  // This is highly efficient and prevents race conditions.
  const newRating = await Rating.findOneAndUpdate(
    { user, recipe },
    { $set: { rating } },
    { new: true, upsert: true }
  );

  // IMPORTANT: After the rating is saved, we call our recipe service
  // to update the average rating on the Recipe document itself.
  await recipeService.updateRecipeRating(recipe);

  return newRating;
};

module.exports = {
  createOrUpdateRating,
};