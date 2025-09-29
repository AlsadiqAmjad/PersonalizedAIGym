const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  fiber: {
    type: Number,
    default: 0
  },
  ingredients: [String],
  instructions: [String],
  prepTime: {
    type: Number,
    default: 0 // in minutes
  },
  servings: {
    type: Number,
    default: 1
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  dietaryTags: [String],
  coachComments: [{
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
mealSchema.index({ userId: 1 });
mealSchema.index({ mealType: 1 });

module.exports = mongoose.model('Meal', mealSchema);