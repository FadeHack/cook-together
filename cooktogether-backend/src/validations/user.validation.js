const Joi = require('joi');

const getSavedRecipes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMyRecipes = getSavedRecipes;

module.exports = {
  getSavedRecipes,
  getMyRecipes,
};