const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins/index');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    firebaseUid: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: 'user',
      required: true
    },
    roleDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
     saved_recipes: { 
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Recipe',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Static methods
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// Static method to check if username is taken
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
