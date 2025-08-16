const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRecipe = {
  body: Joi.object().keys({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().max(500),
    prep_time: Joi.number().integer().required().min(0),
    cook_time: Joi.number().integer().required().min(0),
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    instructions: Joi.array().items(Joi.string()).min(1).required(),
    imageUrl: Joi.string().uri().allow(''),
  }),
};

const getRecipes = {
  query: Joi.object().keys({
    search: Joi.string().allow(''), // Allow empty search string
    sortBy: Joi.string().valid('latest', 'trending'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    minRating: Joi.number().min(0).max(5),
    maxCookTime: Joi.number().integer().min(0),
    maxPrepTime: Joi.number().integer().min(0),
    // Allow ingredients to be a comma-separated string
    ingredients: Joi.string(), 
  }),
};

const getRecipe = {
  params: Joi.object().keys({
    recipeId: Joi.string().custom(objectId).required(),
  }),
};

const rateRecipe = {
  params: Joi.object().keys({
    recipeId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    rating: Joi.number().integer().min(1).max(5).required(),
  }),
};

// This validation can be used for both saving and unsaving
const saveOrUnsaveRecipe = {
  params: Joi.object().keys({
    recipeId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  rateRecipe,
  saveOrUnsaveRecipe,
};