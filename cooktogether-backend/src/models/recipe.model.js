const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for faster search on title
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    prep_time: {
      type: Number,
      required: true,
    },
    cook_time: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
      index: true, // Index for faster search on ingredients
    },
    instructions: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      default: '', // We can store an image URL here
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    total_ratings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add plugin that converts mongoose to json
recipeSchema.plugin(toJSON);
recipeSchema.plugin(paginate);

/**
 * @typedef Recipe
 */
const Recipe = mongoose.model('Recipe', recipeSchema);


module.exports = Recipe;