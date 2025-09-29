const mongoose = require('mongoose');

const nutritionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dailyCalorieTarget: {
    type: Number,
    required: true
  },
  macroTargets: {
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
    }
  },
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
nutritionPlanSchema.index({ userId: 1, isActive: 1 });
nutritionPlanSchema.index({ startDate: 1, endDate: 1 });

// Static method to get active nutrition plan
nutritionPlanSchema.statics.getActivePlan = function(userId) {
  const today = new Date();
  
  return this.findOne({
    userId,
    isActive: true,
    startDate: { $lte: today },
    endDate: { $gte: today }
  }).populate('meals');
};

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);