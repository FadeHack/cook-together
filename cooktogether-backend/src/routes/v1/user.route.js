const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

const router = express.Router();

router
  .route('/me/saved')
  .get(auth(), validate(userValidation.getSavedRecipes), userController.getSavedRecipes);

  router
  .route('/me/recipes')
  .get(auth(), validate(userValidation.getMyRecipes), userController.getMyRecipes);

module.exports = router;