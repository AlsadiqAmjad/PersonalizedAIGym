// Utility to manage onboarding data across pages using localStorage

export const onboardingStorage = {
  // Save onboarding data
  save: (key, value) => {
    const data = onboardingStorage.getAll();
    data[key] = value;
    localStorage.setItem('onboardingData', JSON.stringify(data));
  },

  // Get specific onboarding data
  get: (key) => {
    const data = onboardingStorage.getAll();
    return data[key];
  },

  // Get all onboarding data
  getAll: () => {
    try {
      const stored = localStorage.getItem('onboardingData');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  // Clear all onboarding data
  clear: () => {
    localStorage.removeItem('onboardingData');
  },

  // Build the complete onboarding payload for API
  buildPayload: () => {
    const data = onboardingStorage.getAll();
    
    console.log('Building payload from data:', data);
    
    // Map fitness level
    const levelMap = {
      'Beginner (0-6 months experience)': 'beginner',
      'Intermediate (6 months - 2 years)': 'intermediate',
      'Advanced (2+ years)': 'advanced'
    };

    // Map goals
    const goalMap = {
      'Lose weight': 'lose-weight',
      'Build muscle': 'build-muscle',
      'Improve endurance': 'improve-endurance',
      'General fitness': 'general-fitness',
      'Increase strength': 'build-muscle' // Map to build-muscle
    };

    // Map workout split
    const splitMap = {
      'Full body': 'fb',
      'Upper / Lower': 'ul',
      'Push / Pull / Legs': 'ppl',
      'Bro split (Chest, Back, Shoulders, Arms, Legs)': 'custom',
      'Body part focused': 'custom'
    };

    // Extract days from "2 days" format
    const extractDays = (daysStr) => {
      if (!daysStr) return 3; // default
      const match = daysStr.match(/(\d+)/);
      return match ? parseInt(match[1]) : 3;
    };

    // Extract minutes from "30 minutes" format
    const extractMinutes = (timeStr) => {
      if (!timeStr) return 60; // default
      const match = timeStr.match(/(\d+)/);
      return match ? parseInt(match[1]) : 60;
    };

    // Validate required fields
    const missingFields = [];
    if (!data.age) missingFields.push('age');
    if (!data.gender) missingFields.push('gender');
    if (!data.height) missingFields.push('height');
    if (!data.weight) missingFields.push('weight');
    if (!data.selectedGoal) missingFields.push('fitness goal');
    if (!data.fitnessLevel) missingFields.push('fitness level');
    if (!data.daysPerWeek) missingFields.push('workout days per week');
    if (!data.sessionLength) missingFields.push('session length');
    if (!data.workoutSplit) missingFields.push('workout split');

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const profile = {
      age: Number(data.age),
      weight: Number(data.weight),
      height: Number(data.height),
      gender: data.gender,
      fitnessLevel: levelMap[data.fitnessLevel] || 'beginner',
      goals: data.selectedGoal ? [goalMap[data.selectedGoal] || 'general-fitness'] : ['general-fitness'],
      availableEquipment: data.availableEquipment || ['full-gym-access'],
      timePerWorkout: extractMinutes(data.sessionLength),
      workoutDaysPerWeek: extractDays(data.daysPerWeek),
      workoutSplit: splitMap[data.workoutSplit] || 'fb',
      dietaryRestrictions: data.dietaryRestrictions ? (typeof data.dietaryRestrictions === 'string' ? data.dietaryRestrictions.split(',').map(s => s.trim()).filter(s => s) : data.dietaryRestrictions) : [],
      allergies: data.allergies ? (typeof data.allergies === 'string' ? data.allergies.split(',').map(s => s.trim()).filter(s => s) : data.allergies) : []
    };

    const preferences = {
      workoutTime: data.workoutTime || 'morning',
      preferredExercises: data.preferredExercises ? (typeof data.preferredExercises === 'string' ? data.preferredExercises.split(',').map(s => s.trim()).filter(s => s) : data.preferredExercises) : [],
      dislikedExercises: data.dislikedExercises ? (typeof data.dislikedExercises === 'string' ? data.dislikedExercises.split(',').map(s => s.trim()).filter(s => s) : data.dislikedExercises) : [],
      notifications: {
        email: true,
        push: true,
        workoutReminders: true
      }
    };

    const payload = { profile, preferences };
    console.log('Built payload:', JSON.stringify(payload, null, 2));
    return payload;
  },

  // Validate that all required data is present
  validate: () => {
    const data = onboardingStorage.getAll();
    const required = ['age', 'gender', 'height', 'weight', 'selectedGoal', 'fitnessLevel', 'daysPerWeek', 'sessionLength', 'workoutSplit'];
    const missing = required.filter(field => !data[field]);
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  }
};

