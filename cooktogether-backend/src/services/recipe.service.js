const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Recipe, Rating } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a recipe
 * @param {Object} recipeBody
 * @param {string} authorId - The ID of the authoring user
 * @returns {Promise<Recipe>}
 */
const createRecipe = async (recipeBody, authorId) => {
  return Recipe.create({ ...recipeBody, author: authorId });
};

/**
 * Query for recipes with pagination, search, and sorting
 * @param {Object} filter - An object containing all filter criteria
 * @param {Object} options - Query options from the 'paginate' plugin
 * @returns {Promise<QueryResult>}
 */
const queryRecipes = async (filter, options) => {
  const mongoFilter = {};

  // 1. Handle text search
  if (filter.search) {
    mongoFilter.$or = [
      { title: { $regex: filter.search, $options: 'i' } },
      { ingredients: { $regex: filter.search, $options: 'i' } },
    ];
  }

  // 2. Handle rating filter
  // This check is fine because minRating will be > 0
  if (filter.minRating) {
    mongoFilter.average_rating = { $gte: filter.minRating };
  }

  // 3. Handle cook time filter - THE FIX IS HERE
  // We explicitly check if the value is not undefined, allowing 0 to be a valid filter.
  if (filter.maxCookTime !== undefined) {
    mongoFilter.cook_time = { $lte: filter.maxCookTime };
  }

  // 4. Handle prep time filter - THE FIX IS HERE
  if (filter.maxPrepTime !== undefined) {
    mongoFilter.prep_time = { $lte: filter.maxPrepTime };
  }
  

let sortOptions = { createdAt: -1 }; // Default to 'latest'
  
  if (options.sortBy === 'trending') {
    // For "trending", sort by average rating first, then by total ratings as a tie-breaker.
    sortOptions = { average_rating: -1, total_ratings: -1 };
  }
  // If sortBy is 'latest' or not provided, the default is already set.

  const queryOptions = {
    ...options,
    populate: 'author.name',
    sort: sortOptions, // Pass the sort options to the paginate function
  };
  
  const recipes = await Recipe.paginate(mongoFilter, queryOptions);
  return recipes;
};

/**
 * Get recipe by its ID
 * @param {ObjectId} id
 * @returns {Promise<Recipe>}
 */
const getRecipeById = async (id) => {
  // When fetching a single recipe, we populate the author's name
  return Recipe.findById(id).populate('author', 'username');
};

/**
 * Recalculates and updates a recipe's average rating and total ratings count.
 * This is a powerful pattern: we centralize the complex logic of rating calculation
 * here, and call it whenever a rating is added, changed, or removed.
 * @param {ObjectId} recipeId
 * @returns {Promise<void>}
 */
const updateRecipeRating = async (recipeId) => {
  // The MongoDB Aggregation Pipeline is the most efficient way to calculate this.
  const stats = await Rating.aggregate([
    {
      // Stage 1: Match all ratings for the given recipe
      $match: { recipe: new mongoose.Types.ObjectId(recipeId) },
    },
    {
      // Stage 2: Group them to calculate the average and total count
      $group: {
        _id: '$recipe',
        average_rating: { $avg: '$rating' },
        total_ratings: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    // If we have stats, update the recipe
    await Recipe.findByIdAndUpdate(recipeId, {
      average_rating: stats[0].average_rating.toFixed(2), // Round to 2 decimal places
      total_ratings: stats[0].total_ratings,
    });
  } else {
    // If there are no ratings for this recipe, reset to default values
    await Recipe.findByIdAndUpdate(recipeId, {
      average_rating: 0,
      total_ratings: 0,
    });
  }
};

module.exports = {
  createRecipe,
  queryRecipes,
  getRecipeById,
  updateRecipeRating,
};