const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['warmup', 'exercise', 'cooldown'],
    default: 'exercise'
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  sets: {
    type: Number,
    default: 1
  },
  reps: {
    type: String,
    default: "1"
  },
  weight: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0 // in seconds
  },
  restTime: {
    type: Number,
    default: 60 // in seconds
  },
  muscleGroups: [String],
  equipment: [String],
  exerciseType: {
    type: String,
    enum: ['compound', 'accessory', 'isolation', 'warmup', 'cooldown', 'core'],
    default: 'compound'
  },
  instructions: [String],
  tips: [String],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
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
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutType: {
    type: String,
    enum: ['push', 'pull', 'legs', 'upper', 'lower', 'full-body', 'custom'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  duration: {
    type: Number,
    required: true // in minutes
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  exercises: [exerciseSchema],
  scheduledDate: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  isCoachEdited: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedAt: Date,
  currentExerciseIndex: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
workoutSchema.index({ userId: 1, scheduledDate: 1 });
workoutSchema.index({ userId: 1, isCompleted: 1 });

// Static method to get today's workout
workoutSchema.statics.getTodaysWorkout = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.findOne({
    userId,
    scheduledDate: {
      $gte: today,
      $lt: tomorrow
    }
  });
};

// Instance method to mark workout as completed
workoutSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

// Instance method to complete current exercise and move to next
workoutSchema.methods.completeCurrentExercise = function() {
  if (this.currentExerciseIndex < this.exercises.length) {
    this.exercises[this.currentExerciseIndex].isCompleted = true;
    this.exercises[this.currentExerciseIndex].completedAt = new Date();
    this.currentExerciseIndex++;
    
    // If all exercises are completed, mark workout as completed
    if (this.currentExerciseIndex >= this.exercises.length) {
      this.isCompleted = true;
      this.completedAt = new Date();
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to get current exercise
workoutSchema.methods.getCurrentExercise = function() {
  if (this.currentExerciseIndex < this.exercises.length) {
    return this.exercises[this.currentExerciseIndex];
  }
  return null;
};

// Instance method to get workout progress
workoutSchema.methods.getProgress = function() {
  const completedExercises = this.exercises.filter(ex => ex.isCompleted).length;
  const totalExercises = this.exercises.length;
  return {
    completed: completedExercises,
    total: totalExercises,
    percentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
  };
};

module.exports = mongoose.model('Workout', workoutSchema);