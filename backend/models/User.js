const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Coach-specific fields
  coachProfile: {
    specialization: [String], // e.g., ['strength-training', 'cardio', 'nutrition']
    experience: Number, // years of experience
    bio: String,
    clients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  profile: {
    age: {
      type: Number,
      min: 13,
      max: 120
    },
    weight: {
      type: Number,
      min: 30,
      max: 300
    },
    height: {
      type: Number,
      min: 100,
      max: 250
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    goals: [{
      type: String,
      enum: ['lose-weight', 'build-muscle', 'improve-endurance', 'general-fitness']
    }],
    availableEquipment: [{
      type: String,
      enum: ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands', 'full-gym-access', 'Full Gym Access']
    }],
    timePerWorkout: {
      type: Number,
      min: 15,
      max: 180
    },
    workoutDaysPerWeek: {
      type: Number,
      min: 1,
      max: 7
    },
    workoutSplit: {
      type: String,
      enum: ['ppl', 'fb', 'ul', 'custom']
    },
    dietaryRestrictions: [String],
    allergies: [String]
  },
  preferences: {
    workoutTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    },
    preferredExercises: [String],
    dislikedExercises: [String],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      workoutReminders: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Index for email
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user with password (for login)
userSchema.statics.findOneWithPassword = function(query) {
  return this.findOne(query).select('+password');
};

module.exports = mongoose.model('User', userSchema);