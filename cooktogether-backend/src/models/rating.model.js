const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const ratingSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
ratingSchema.plugin(toJSON);

// Create a compound index to ensure a user can only rate a recipe once
ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

/**
 * @typedef Rating
 */
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;