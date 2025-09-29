const mongoose = require('mongoose');

const workoutScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitType: {
    type: String,
    enum: ['ppl', 'fb', 'ul', 'custom'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  schedule: [{
    date: {
      type: Date,
      required: true
    },
    workoutType: {
      type: String,
      required: true
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
workoutScheduleSchema.index({ userId: 1, isActive: 1 });
workoutScheduleSchema.index({ userId: 1, 'schedule.date': 1 });

// Static method to get today's workout
workoutScheduleSchema.statics.getTodaysWorkout = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    userId,
    isActive: true,
    'schedule.date': {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  }).populate('schedule.workoutId');
};

// Static method to get weekly schedule
workoutScheduleSchema.statics.getWeeklySchedule = function(userId, startDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return this.findOne({
    userId,
    isActive: true,
    'schedule.date': {
      $gte: start,
      $lt: end
    }
  }).populate('schedule.workoutId');
};

module.exports = mongoose.model('WorkoutSchedule', workoutScheduleSchema);
