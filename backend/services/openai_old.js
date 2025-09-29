const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

class OpenAIService {
  // Evidence-based training parameters
  static VOLUME_TARGETS = {
    hypertrophy: { min: 10, max: 20, optimal: 16 },
    strength: { min: 8, max: 12, optimal: 10 },
    fat_loss: { min: 10, max: 16, optimal: 12 },
    general_fitness: { min: 6, max: 10, optimal: 8 }
  };

  static FREQUENCY_RANGES = {
    beginner: { min: 2, max: 3 },
    novice: { min: 3, max: 4 },
    intermediate: { min: 4, max: 6 },
    advanced: { min: 5, max: 6 }
  };

  static RIR_TARGETS = {
    hypertrophy: { compounds: '1-3', accessories: '0-2', isolation: '0-1' },
    strength: { compounds: '0-2', accessories: '1-3', isolation: '1-2' },
    fat_loss: { compounds: '1-3', accessories: '0-2', isolation: '0-1' },
    general_fitness: { compounds: '2-3', accessories: '1-3', isolation: '1-2' }
  };
  // Generate personalized workout plan
  static async generateWorkoutPlan(userProfile, preferences, workoutDaysPerWeek = 3, workoutType = 'custom') {
    const prompt = this.buildWorkoutPrompt(userProfile, preferences, workoutDaysPerWeek, workoutType);
    
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert fitness trainer and exercise physiologist. Generate safe, effective workout exercises based on user profile. Always prioritize safety and proper form. Return ONLY a valid JSON array of exercises with the exact structure specified.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response - remove markdown formatting if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const exercises = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!Array.isArray(exercises)) {
        throw new Error('Invalid response format');
      }

      return exercises;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  // Generate personalized meal plan
  static async generateMealPlan(userProfile, dailyCalorieTarget, dietaryRestrictions = [], allergies = []) {
    const prompt = this.buildMealPrompt(userProfile, dailyCalorieTarget, dietaryRestrictions, allergies);
    
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a certified nutritionist and dietitian. Generate healthy, balanced meal suggestions based on user profile and dietary requirements. Always prioritize nutritional balance and safety. Return ONLY a valid JSON array of meals with the exact structure specified.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response - remove markdown formatting if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const meals = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!Array.isArray(meals)) {
        throw new Error('Invalid response format');
      }

      return meals;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  // Build comprehensive workout generation prompt (Jeff Nippard-style)
  static buildWorkoutPrompt(userProfile, preferences, workoutDaysPerWeek, workoutType = 'custom') {
    const goals = Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'general fitness';
    const equipment = Array.isArray(userProfile.availableEquipment) ? userProfile.availableEquipment.join(', ') : 'bodyweight';
    const preferredExercises = Array.isArray(preferences?.preferredExercises) ? preferences.preferredExercises.join(', ') : 'None specified';
    const dislikedExercises = Array.isArray(preferences?.dislikedExercises) ? preferences.dislikedExercises.join(', ') : 'None specified';
    
    // Determine primary goal for volume calculations
    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    const volumeTargets = this.VOLUME_TARGETS[primaryGoal];
    const rirTargets = this.RIR_TARGETS[primaryGoal];
    
    // Get workout split information
    const workoutSplit = userProfile.workoutSplit || 'custom';
    const splitDescription = this.getSplitDescription(workoutSplit, workoutDaysPerWeek);
    
    // Calculate optimal split based on experience and time
    const optimalSplit = this.determineOptimalSplit(userProfile.fitnessLevel, workoutDaysPerWeek, workoutSplit);
    
    // Age-specific considerations
    const ageConsiderations = this.getAgeConsiderations(userProfile.age);
    
    // Calculate volume parameters
    const volumeParams = this.getVolumeParameters(userProfile.fitnessLevel, workoutSplit, optimalSplit);
    
    return `
You are an expert fitness coach creating evidence-based workout plans inspired by Jeff Nippard's methodology. Generate a comprehensive workout plan following these principles:

EVIDENCE-BASED FOUNDATION:
- Volume is the main driver for hypertrophy (${volumeTargets.min}-${volumeTargets.max} sets per muscle group per week)
- Frequency is a delivery mechanism (2-3x per muscle group per week optimal)
- Train hard near failure (${rirTargets.compounds} RIR for compounds, ${rirTargets.accessories} RIR for accessories)
- Longer rests (90-180s) improve strength and hypertrophy
- Avoid junk volume - use the lowest dose that reliably works

USER PROFILE:
- Age: ${userProfile.age} (${ageConsiderations})
- Weight: ${userProfile.weight} kg, Height: ${userProfile.height} cm
- Gender: ${userProfile.gender}
- Training Level: ${userProfile.fitnessLevel}
- Primary Goal: ${primaryGoal}
- Goals: ${Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'Not specified'}
- Available Equipment: ${equipment}
- Time per Session: ${userProfile.timePerWorkout} minutes
- Days per Week: ${workoutDaysPerWeek}
- Preferred Split: ${workoutSplit.toUpperCase()} → Optimal: ${optimalSplit}
- Preferred Exercises: ${preferredExercises}
- Disliked Exercises: ${dislikedExercises}
- Dietary Restrictions: ${Array.isArray(userProfile.dietaryRestrictions) ? userProfile.dietaryRestrictions.join(', ') : 'None'}
- Allergies: ${Array.isArray(userProfile.allergies) ? userProfile.allergies.join(', ') : 'None'}
- Injuries/Limitations: ${preferences?.injuries || 'None reported'}
- Workout Preferences: ${preferences?.workoutPreferences || 'None specified'}
- Experience with Lifts: ${preferences?.experienceWithLifts || 'Not specified'}
- Context: Steps per day: ${preferences?.stepsPerDay || 'Not specified'}, Sport: ${preferences?.sport || 'None'}, Sleep: ${preferences?.sleepHours || 'Not specified'} hours

TRAINING PARAMETERS:
- Weekly Volume Target: ${volumeTargets.optimal} sets per muscle group
- Exercise Count: ${volumeParams.exerciseCount} exercises per session
- Sets per Exercise: ${volumeParams.setsPerExercise} sets each
- Total Sets: ${volumeParams.totalSets} sets per session
- Rep Ranges: ${this.getRepRanges(primaryGoal)}
- RIR Targets: Compounds ${rirTargets.compounds}, Accessories ${rirTargets.accessories}
- Rest Periods: Compounds 90-180s, Accessories 60-90s
- Progression: Double progression (add weight when hitting top of rep range for 2 sessions)

WORKOUT STRUCTURE REQUIREMENTS:
1. Generate exercises based on experience level and split type
2. Include warm-up routine (5-8 minutes)
3. Include cool-down routine (static stretching)
4. Distribute volume properly across muscle groups
5. Follow split-specific muscle targeting

EXPERIENCE-BASED VOLUME:
- Beginner: 4-5 exercises, 2-3 sets each (8-15 total sets)
- Intermediate: 5-6 exercises, 3-4 sets each (15-24 total sets)
- Advanced: 6-8 exercises, 2-4 sets each (12-32 total sets)

SPLIT-SPECIFIC REQUIREMENTS:
- PPL Push Day: Target ALL push muscles comprehensively
  * Chest: Upper chest (incline), mid chest (flat), lower chest (decline), inner chest (flyes)
  * Shoulders: Front delts (presses), side delts (lateral raises), rear delts (reverse flyes)
  * Triceps: All three heads - long head (overhead), lateral head (close-grip), medial head (dips)
- PPL Pull Day: Target ALL pull muscles comprehensively
  * Back: Upper back (rows), mid back (pull-downs), lower back (deadlifts), lats (wide-grip)
  * Biceps: Long head (wide-grip curls), short head (narrow-grip curls), brachialis (hammer curls)
  * Rear Delts: Face pulls, reverse flyes, rear delt rows
- PPL Legs Day: Target ALL leg muscles comprehensively
  * Quads: Front squats, leg press, lunges, leg extensions
  * Glutes: Hip thrusts, Romanian deadlifts, glute bridges, Bulgarian split squats
  * Hamstrings: Deadlifts, leg curls, good mornings
  * Calves: Standing calf raises, seated calf raises, calf press
- Upper/Lower: Upper days hit chest, back, shoulders, arms; Lower days hit quads, glutes, hamstrings
- Full Body: 1-2 exercises per major muscle group (more exercises, fewer sets per exercise)

VOLUME DISTRIBUTION BY SPLIT:
- Full Body: 1-2 sets per exercise (lower volume per muscle, more exercises)
- Upper/Lower: 2-3 sets per exercise (moderate volume per muscle)
- PPL: 3-4 sets per exercise (higher volume per muscle, fewer exercises)

ADVANCED LIFTER REQUIREMENTS:
- Must include 6-8 exercises per session
- Target ALL muscle regions within the split comprehensively
- Include both heavy compounds and isolation work
- Use advanced techniques (drop sets, supersets, etc.)
- Higher volume per muscle group (3-4 sets each)

PPL PUSH DAY REQUIREMENTS (${workoutType === 'push' ? 'CURRENT WORKOUT' : 'REFERENCE'}):
- Chest: 2-3 exercises (upper, mid, lower chest)
- Shoulders: 2-3 exercises (front, side, rear delts)
- Triceps: 2-3 exercises (all three heads)
- Total: 6-9 exercises minimum for advanced lifters
- Include both compound and isolation movements
- Progressive overload with proper form

Return ONLY a JSON array with this exact structure:
[
  {
    "type": "warmup",
    "name": "Dynamic Warm-up",
    "description": "5-8 minute warm-up routine",
    "duration": 8,
    "exercises": [
      "Light cardio (bike/treadmill) - 3 minutes",
      "Arm circles - 30 seconds",
      "Leg swings - 30 seconds each leg",
      "Bodyweight squats - 10 reps",
      "Push-ups - 5 reps"
    ]
  },
  {
    "type": "exercise",
    "name": "Exercise Name",
    "description": "Brief description of the exercise",
    "sets": 3,
    "reps": 12,
    "weight": 0,
    "duration": 0,
    "restTime": 60,
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "equipment": ["dumbbells", "bench"],
        "exerciseType": "compound",
        "instructions": [
          "Step 1: Starting position",
          "Step 2: Movement",
          "Step 3: Return to start"
        ],
        "tips": [
          "Keep your core engaged",
          "Control the movement"
        ]
  },
  {
    "type": "cooldown",
    "name": "Static Stretching",
    "description": "5-10 minute cool-down routine",
    "duration": 10,
    "exercises": [
      "Chest stretch - 30 seconds",
      "Shoulder stretch - 30 seconds each",
      "Quad stretch - 30 seconds each",
      "Hamstring stretch - 30 seconds each",
      "Deep breathing - 2 minutes"
    ]
  }
]

Important: Return ONLY the JSON array, no additional text or formatting.`;
  }

  // Determine primary goal for volume calculations
  static determinePrimaryGoal(goals) {
    if (!Array.isArray(goals) || goals.length === 0) return 'general_fitness';
    
    const goalMap = {
      'build-muscle': 'hypertrophy',
      'strength': 'strength',
      'lose-weight': 'fat_loss',
      'improve-endurance': 'general_fitness',
      'general-fitness': 'general_fitness'
    };
    
    return goalMap[goals[0]] || 'general_fitness';
  }

  // Get rep ranges based on goal
  static getRepRanges(goal) {
    const ranges = {
      hypertrophy: '6-12 (primary), 5-30 acceptable',
      strength: '1-6 (primary), 8-12 accessories',
      fat_loss: '6-12 (maintain strength), 8-15 accessories',
      general_fitness: '8-15 (moderate intensity)'
    };
    return ranges[goal] || ranges.general_fitness;
  }

  // Determine optimal split based on experience and time
  static determineOptimalSplit(fitnessLevel, daysPerWeek, userPreference) {
    if (userPreference !== 'custom') {
      return userPreference.toUpperCase();
    }

    if (fitnessLevel === 'beginner' && daysPerWeek <= 3) {
      return 'FULL_BODY';
    } else if (fitnessLevel === 'intermediate' && daysPerWeek <= 4) {
      return 'UPPER_LOWER';
    } else if (daysPerWeek >= 5) {
      return 'PPL';
    } else {
      return 'FULL_BODY';
    }
  }

  // Get age-specific considerations
  static getAgeConsiderations(age) {
    if (age < 18) return 'teen - focus on technique, avoid 1RM testing';
    if (age >= 40 && age < 60) return 'mature adult - longer warm-ups, prioritize recovery';
    if (age >= 60) return 'older adult - conservative approach, longer rests, higher protein per meal';
    return 'prime training age';
  }

  // Calculate optimal exercise count and sets based on experience and split
  static getVolumeParameters(fitnessLevel, splitType, workoutType) {
    const baseVolume = {
      beginner: { exercises: 4, setsPerExercise: 2 },
      intermediate: { exercises: 5, setsPerExercise: 3 },
      advanced: { exercises: 6, setsPerExercise: 3 }
    };

    const splitModifiers = {
      'full-body': { exerciseMultiplier: 1.5, setMultiplier: 0.7 }, // More exercises, fewer sets
      'upper-lower': { exerciseMultiplier: 1.0, setMultiplier: 1.0 }, // Standard
      'ppl': { exerciseMultiplier: 0.8, setMultiplier: 1.3 } // Fewer exercises, more sets
    };

    const base = baseVolume[fitnessLevel] || baseVolume.intermediate;
    const modifier = splitModifiers[splitType] || splitModifiers['upper-lower'];

    const exercises = Math.round(base.exercises * modifier.exerciseMultiplier);
    const setsPerExercise = Math.round(base.setsPerExercise * modifier.setMultiplier);

    return {
      exerciseCount: Math.max(3, Math.min(8, exercises)),
      setsPerExercise: Math.max(1, Math.min(5, setsPerExercise)),
      totalSets: exercises * setsPerExercise
    };
  }

  // Get workout split description
  static getSplitDescription(split, workoutDaysPerWeek) {
    switch (split) {
      case 'ppl':
        return 'Push/Pull/Legs split - Focus on pushing movements (chest, shoulders, triceps), pulling movements (back, biceps), and leg exercises. Rotate through these three categories.';
      case 'fb':
        return 'Full Body split - Work all major muscle groups in each session. Ideal for beginners or those with limited time.';
      case 'ul':
        return 'Upper/Lower split - Alternate between upper body workouts (chest, back, shoulders, arms) and lower body workouts (legs, glutes).';
      case 'custom':
        return 'AI-determined split - Let the AI choose the best split based on your schedule, goals, and preferences.';
      default:
        return 'General workout structure based on your goals and schedule.';
    }
  }

  // Build comprehensive nutrition prompt (evidence-based)
  static buildMealPrompt(userProfile, dailyCalorieTarget, dietaryRestrictions, allergies) {
    const goals = Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'general fitness';
    const restrictions = Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None';
    const allergyList = Array.isArray(allergies) && allergies.length > 0 ? allergies.join(', ') : 'None';
    
    // Calculate optimal macros based on evidence
    const macros = this.calculateOptimalMacros(userProfile, dailyCalorieTarget);
    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    
    return `
You are a nutrition expert creating evidence-based meal plans. Generate a comprehensive nutrition plan following these principles:

EVIDENCE-BASED NUTRITION FOUNDATION:
- Protein: ${macros.protein}g/day (${macros.proteinPerKg}g/kg) - preserves/builds lean mass
- Fat: ${macros.fat}g/day (${macros.fatPerKg}g/kg) - minimum for hormone production
- Carbs: ${macros.carbs}g/day - fills remaining calories, higher on training days
- Protein timing: 0.25-0.4g/kg per meal, 3-5 meals spaced 3-4 hours apart
- Pre/post workout: Include protein + carbs within 1-2 hours of training

USER PROFILE:
- Age: ${userProfile.age}, Weight: ${userProfile.weight} kg, Height: ${userProfile.height} cm
- Gender: ${userProfile.gender}
- Primary Goal: ${primaryGoal}
- Daily Calorie Target: ${dailyCalorieTarget} calories
- Dietary Restrictions: ${restrictions}
- Allergies: ${allergyList}

MACRO TARGETS:
- Protein: ${macros.protein}g (${macros.proteinPercent}% of calories)
- Fat: ${macros.fat}g (${macros.fatPercent}% of calories)  
- Carbs: ${macros.carbs}g (${macros.carbPercent}% of calories)
- Fiber: ~${Math.round(dailyCalorieTarget / 1000 * 14)}g (14g per 1000 calories)

NUTRITION QUALITY GUIDELINES:
1. 80/20 rule: 80% whole foods, 20% flexibility
2. Prioritize lean proteins, complex carbs, healthy fats
3. Include 5+ servings of fruits/vegetables daily
4. Hydration: 30-40ml/kg body weight
5. Meal timing: Protein every 3-4 hours, pre/post workout nutrition

Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Meal Name",
    "description": "Brief description of the meal",
    "calories": 500,
    "protein": 25,
    "carbs": 45,
    "fat": 20,
    "fiber": 8,
    "ingredients": [
      "ingredient 1",
      "ingredient 2"
    ],
    "instructions": [
      "Step 1: Preparation",
      "Step 2: Cooking",
      "Step 3: Serving"
    ],
    "prepTime": 15,
    "servings": 1,
    "mealType": "breakfast",
    "dietaryTags": ["high-protein", "low-carb"]
  }
]

Important: Return ONLY the JSON array, no additional text or formatting.`;
  }

  // Calculate daily calorie target based on user profile
  // Calculate optimal macros based on evidence (Jeff Nippard-style)
  static calculateOptimalMacros(userProfile, dailyCalories) {
    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    const weight = userProfile.weight;
    
    // Protein calculation (evidence-based)
    let proteinPerKg = 1.6; // Baseline
    if (primaryGoal === 'fat_loss') {
      proteinPerKg = 2.3; // Higher for muscle preservation during cuts
    } else if (primaryGoal === 'hypertrophy') {
      proteinPerKg = 2.0; // Optimal for muscle building
    } else if (userProfile.age >= 60) {
      proteinPerKg = 2.0; // Higher for older adults
    }
    
    const protein = Math.round(weight * proteinPerKg);
    const proteinCalories = protein * 4;
    
    // Fat calculation (minimum for hormone production)
    const fatPerKg = 0.8; // Minimum 0.6-1.0g/kg
    const fat = Math.round(weight * fatPerKg);
    const fatCalories = fat * 9;
    
    // Carbs fill remaining calories
    const carbCalories = dailyCalories - proteinCalories - fatCalories;
    const carbs = Math.round(carbCalories / 4);
    
    return {
      protein,
      fat,
      carbs,
      proteinPerKg: proteinPerKg.toFixed(1),
      fatPerKg: fatPerKg.toFixed(1),
      proteinPercent: Math.round((proteinCalories / dailyCalories) * 100),
      fatPercent: Math.round((fatCalories / dailyCalories) * 100),
      carbPercent: Math.round((carbCalories / dailyCalories) * 100)
    };
  }

  // Calculate daily calorie target (Mifflin-St Jeor + evidence-based adjustments)
  static calculateDailyCalorieTarget(userProfile) {
    // Mifflin-St Jeor Equation for BMR (more accurate than Harris-Benedict)
    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }

    // Physical Activity Level (PAL) based on training frequency and intensity
    let pal = 1.2; // Sedentary baseline
    
    const workoutDays = userProfile.workoutDaysPerWeek || 3;
    const sessionMinutes = userProfile.timePerWorkout || 60;
    
    // Adjust PAL based on training volume
    if (workoutDays >= 5 && sessionMinutes >= 60) {
      pal = 1.6; // Very active
    } else if (workoutDays >= 4 && sessionMinutes >= 45) {
      pal = 1.5; // Active
    } else if (workoutDays >= 3) {
      pal = 1.4; // Moderately active
    } else if (workoutDays >= 2) {
      pal = 1.3; // Lightly active
    }

    const tdee = bmr * pal;

    // Apply evidence-based goal adjustments
    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    
    let calorieTarget = tdee;
    if (primaryGoal === 'fat_loss') {
      // 15-25% deficit for sustainable fat loss
      calorieTarget = tdee * 0.8; // 20% deficit
    } else if (primaryGoal === 'hypertrophy') {
      // 5-15% surplus for lean gains
      calorieTarget = tdee * 1.1; // 10% surplus
    } else if (primaryGoal === 'strength') {
      // Small surplus for strength gains
      calorieTarget = tdee * 1.05; // 5% surplus
    }

    // Ensure reasonable bounds
    return Math.max(1200, Math.min(4000, Math.round(calorieTarget)));
  }

  // Generate replacement exercise
  static async generateReplacementExercise(exerciseToReplace, userProfile, preferences, reason) {
    const prompt = `Generate a replacement exercise that targets the same muscle groups as "${exerciseToReplace.name}" but is different in execution.

Original Exercise Details:
- Name: ${exerciseToReplace.name}
- Description: ${exerciseToReplace.description}
- Muscle Groups: ${Array.isArray(exerciseToReplace.muscleGroups) ? exerciseToReplace.muscleGroups.join(', ') : 'Not specified'}
- Equipment: ${Array.isArray(exerciseToReplace.equipment) ? exerciseToReplace.equipment.join(', ') : 'Not specified'}
- Sets: ${exerciseToReplace.sets}
- Reps: ${exerciseToReplace.reps}

User Profile:
- Fitness Level: ${userProfile.fitnessLevel || 'intermediate'}
- Available Equipment: ${Array.isArray(userProfile.availableEquipment) ? userProfile.availableEquipment.join(', ') : 'Not specified'}
- Goals: ${Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'Not specified'}

Reason for Replacement: ${reason || 'User preference'}

Generate a replacement exercise that:
1. Targets the same primary muscle groups
2. Uses similar or available equipment
3. Maintains similar intensity level
4. Is appropriate for ${userProfile.fitnessLevel || 'intermediate'} level
5. Provides variety and freshness

Return the exercise in this exact JSON format:
{
  "name": "Exercise Name",
  "description": "Brief description of the exercise",
  "sets": 3,
  "reps": 12,
  "weight": 0,
  "duration": 0,
  "restTime": 60,
  "muscleGroups": ["primary", "secondary"],
  "equipment": ["equipment1", "equipment2"],
  "instructions": [
    "Step 1: Starting position",
    "Step 2: Movement execution",
    "Step 3: Completion"
  ],
  "tips": [
    "Form tip 1",
    "Form tip 2"
  ]
}

Important: Return ONLY the JSON object, no additional text or formatting.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0].message.content.trim();
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI exercise replacement error:', error);
      throw error;
    }
  }

  // Generate replacement meal
  static async generateReplacementMeal(mealToReplace, userProfile, dailyCalorieTarget, dietaryRestrictions, allergies, reason) {
    const prompt = `Generate a replacement meal for "${mealToReplace.name}" that maintains similar nutritional value but offers variety.

Original Meal Details:
- Name: ${mealToReplace.name}
- Description: ${mealToReplace.description}
- Calories: ${mealToReplace.calories}
- Protein: ${mealToReplace.protein}g
- Carbs: ${mealToReplace.carbs}g
- Fat: ${mealToReplace.fat}g
- Meal Type: ${mealToReplace.mealType}

User Profile:
- Daily Calorie Target: ${dailyCalorieTarget}
- Dietary Restrictions: ${Array.isArray(dietaryRestrictions) ? dietaryRestrictions.join(', ') : 'None'}
- Allergies: ${Array.isArray(allergies) ? allergies.join(', ') : 'None'}
- Goals: ${Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'Not specified'}

Reason for Replacement: ${reason || 'User preference'}

Generate a replacement meal that:
1. Maintains similar calorie count (±50 calories)
2. Provides similar macronutrient balance
3. Respects dietary restrictions and allergies
4. Offers variety and freshness
5. Is appropriate for ${mealToReplace.mealType}

Return the meal in this exact JSON format:
{
  "name": "Meal Name",
  "description": "Brief description of the meal",
  "calories": 600,
  "protein": 30,
  "carbs": 50,
  "fat": 25,
  "fiber": 10,
  "ingredients": [
    "ingredient 1",
    "ingredient 2",
    "ingredient 3"
  ],
  "instructions": [
    "Step 1: Preparation step",
    "Step 2: Cooking step",
    "Step 3: Serving step"
  ],
  "prepTime": 20,
  "servings": 1,
  "mealType": "breakfast",
  "dietaryTags": ["tag1", "tag2"]
}

Important: Return ONLY the JSON object, no additional text or formatting.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 600
      });

      const content = response.choices[0].message.content.trim();
      
      // Clean the response - remove markdown formatting if present
      let cleanedContent = content;
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('OpenAI meal replacement error:', error);
      throw error;
    }
  }
}

module.exports = OpenAIService;
