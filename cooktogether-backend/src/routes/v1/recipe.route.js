const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { recipeValidation } = require('../../validations');
const { recipeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(recipeValidation.createRecipe), recipeController.createRecipe)
  .get(validate(recipeValidation.getRecipes), recipeController.getRecipes);

router
  .route('/:recipeId')
  .get(validate(recipeValidation.getRecipe), recipeController.getRecipe);

router
  .route('/:recipeId/rate')
  .post(auth(), validate(recipeValidation.rateRecipe), recipeController.rateRecipe);

// Using POST for save and DELETE for unsave is a more RESTful approach
router
  .route('/:recipeId/save')
  .post(auth(), validate(recipeValidation.saveOrUnsaveRecipe), recipeController.saveRecipe)
  .delete(auth(), validate(recipeValidation.saveOrUnsaveRecipe), recipeController.unsaveRecipe);


module.exports = router;