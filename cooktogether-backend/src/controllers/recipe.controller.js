const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recipeService, ratingService, userService } = require('../services');

const createRecipe = catchAsync(async (req, res) => {
  // We pass the request body and the logged-in user's ID (from the auth middleware) to the service
  const recipe = await recipeService.createRecipe(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(recipe);
});

const getRecipes = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  console.log('Query options:', req.query);
  const filter = pick(req.query, ['search', 'minRating', 'maxCookTime', 'maxPrepTime']);

  const result = await recipeService.queryRecipes(filter, options);
  res.send(result);
});

const getRecipe = catchAsync(async (req, res) => {
  const recipe = await recipeService.getRecipeById(req.params.recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  res.send(recipe);
});

const rateRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  const ratingResult = await ratingService.createOrUpdateRating({ user: userId, recipe: recipeId, rating });
  // After a successful rating, we send back the rating object, confirming the action.
  res.status(httpStatus.OK).send(ratingResult);
});

const saveRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;
  await userService.saveRecipe(userId, recipeId);
  // Using 204 No Content is a standard RESTful practice for actions that succeed but don't need to return data.
  res.status(httpStatus.NO_CONTENT).send();
});

const unsaveRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;
  await userService.unsaveRecipe(userId, recipeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  rateRecipe,
  saveRecipe,
  unsaveRecipe,
};