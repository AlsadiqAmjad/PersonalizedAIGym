const WorkoutSchedule = require('../models/WorkoutSchedule');
const Workout = require('../models/Workout');

class ScheduleService {
  // Generate workout schedule based on split and preferences
  static async generateSchedule(userId, splitType, workoutDaysPerWeek, startDate = new Date()) {
    // Deactivate existing schedules
    await WorkoutSchedule.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    const schedule = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    // Generate 4 weeks of schedule
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate.getTime() + (week * 7 + day) * 24 * 60 * 60 * 1000);
        
        // Determine if this day should have a workout
        if (this.shouldHaveWorkout(day, splitType, workoutDaysPerWeek)) {
          const workoutType = this.getWorkoutType(day, splitType, week);
          
          schedule.push({
            date,
            workoutType,
            isCompleted: false
          });
        }
      }
    }

    // Create the schedule
    const workoutSchedule = new WorkoutSchedule({
      userId,
      splitType,
      startDate: currentDate,
      schedule
    });

    return await workoutSchedule.save();
  }

  // Determine if a day should have a workout
  static shouldHaveWorkout(dayOfWeek, splitType, workoutDaysPerWeek) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Common workout days (avoid Sunday for most people)
    const commonWorkoutDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    if (workoutDaysPerWeek >= 6) {
      return commonWorkoutDays.includes(dayName);
    } else if (workoutDaysPerWeek === 5) {
      return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(dayName);
    } else if (workoutDaysPerWeek === 4) {
      return ['monday', 'tuesday', 'thursday', 'friday'].includes(dayName);
    } else if (workoutDaysPerWeek === 3) {
      return ['monday', 'wednesday', 'friday'].includes(dayName);
    } else if (workoutDaysPerWeek === 2) {
      return ['monday', 'thursday'].includes(dayName);
    }
    
    return false;
  }

  // Get workout type for a specific day
  static getWorkoutType(dayOfWeek, splitType, week) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    switch (splitType) {
      case 'ppl':
        return this.getPPLWorkoutType(dayName, week);
      case 'ul':
        return this.getUpperLowerWorkoutType(dayName, week);
      case 'fb':
        return 'full-body';
      default:
        return 'custom';
    }
  }

  // Get PPL workout type
  static getPPLWorkoutType(dayName, week) {
    const pplCycle = ['push', 'pull', 'legs'];
    
    // Map all possible workout days to their cycle position
    const dayMapping = {
      'monday': 0,    // push
      'tuesday': 1,   // pull
      'wednesday': 2, // legs
      'thursday': 0,  // push
      'friday': 1,    // pull
      'saturday': 2   // legs
    };
    
    const cycleIndex = dayMapping[dayName];
    if (cycleIndex === undefined) return null;
    
    return pplCycle[cycleIndex];
  }

  // Get Upper/Lower workout type
  static getUpperLowerWorkoutType(dayName, week) {
    const ulCycle = ['upper', 'lower'];
    
    // Map all possible workout days to their cycle position
    const dayMapping = {
      'monday': 0,    // upper
      'tuesday': 1,   // lower
      'wednesday': 0, // upper
      'thursday': 1,  // lower
      'friday': 0,    // upper
      'saturday': 1   // lower
    };
    
    const cycleIndex = dayMapping[dayName];
    if (cycleIndex === undefined) return null;
    
    return ulCycle[cycleIndex];
  }

  // Get today's workout
  static async getTodaysWorkout(userId) {
    return await WorkoutSchedule.getTodaysWorkout(userId);
  }

  // Get weekly schedule
  static async getWeeklySchedule(userId, startDate) {
    return await WorkoutSchedule.getWeeklySchedule(userId, startDate);
  }

  // Update schedule when user changes split
  static async updateSchedule(userId, newSplitType, workoutDaysPerWeek) {
    const existingSchedule = await WorkoutSchedule.findOne({ userId, isActive: true });
    
    if (existingSchedule) {
      // Generate new schedule starting from today
      return await this.generateSchedule(userId, newSplitType, workoutDaysPerWeek, new Date());
    }
    
    return null;
  }
}

module.exports = ScheduleService;
