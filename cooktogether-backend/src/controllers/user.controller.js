const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getSavedRecipes = catchAsync(async (req, res) => {
  // The user ID comes from the authenticated user token
  const userId = req.user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = [{ path: 'author', select: 'username' }];
  
  const savedRecipes = await userService.getSavedRecipes(userId, options);
  res.status(httpStatus.OK).send(savedRecipes);
});

const getMyRecipes = catchAsync(async (req, res) => {
  // The user ID comes from the authenticated user token (auth middleware)
  const userId = req.user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = [{ path: 'author', select: 'username' }];

  const myRecipes = await userService.getMyRecipes(userId, options);
  res.status(httpStatus.OK).send(myRecipes);
});

module.exports = {
  getSavedRecipes,
  getMyRecipes,
};