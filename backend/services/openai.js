const OpenAI = require('openai');

const MODEL = 'gpt-3.5-turbo'; 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
class OpenAIService {
  static VOLUME_TARGETS = {
    hypertrophy: { min: 10, max: 20, optimal: 16 },
    strength: { min: 8, max: 12, optimal: 10 },
    fat_loss: { min: 8, max: 16, optimal: 12 },
    general_fitness: { min: 6, max: 12, optimal: 8 }
  };
  // RIR targets by goal
  static RIR_TARGETS = {
    hypertrophy: { compounds: '1-3', accessories: '0-2', isolation: '0-1' },
    strength: { compounds: '0-2', accessories: '1-3', isolation: '1-2' },
    fat_loss: { compounds: '1-3', accessories: '0-2', isolation: '0-1' },
    general_fitness: { compounds: '2-3', accessories: '1-3', isolation: '1-2' }
  };
  // Generate a personalized workout plan
  static async generateWorkoutPlan(userProfile, preferences, workoutDaysPerWeek = 3, workoutType = 'custom') {
    try {
      console.log('=== AI WORKOUT GENERATION DEBUG ===');
      console.log('User Profile:', JSON.stringify(userProfile, null, 2));
      console.log('Preferences:', JSON.stringify(preferences, null, 2));
      console.log('Workout Days:', workoutDaysPerWeek);
      console.log('Workout Split:', userProfile.workoutSplit);
      console.log('Goals:', userProfile.goals);
      console.log('=====================================');

      // Try AI generation first, but fallback to template-based generation
      try {
        // Step 1: Generate detailed workout plan in natural language
        const detailedPlan = await this.generateDetailedWorkoutPlan(
          userProfile,
          preferences,
          workoutDaysPerWeek,
          workoutType
        );
        // Step 2: Convert to structured JSON
        const structuredPlan = await this.convertPlanToJSON(detailedPlan, workoutType);

        return structuredPlan;
      } catch (aiError) {
        console.log('AI workout generation failed, using template-based generation:', aiError.message);
        return this.generateTemplateWorkout(userProfile, preferences, workoutDaysPerWeek, workoutType);
      }
    } catch (error) {
      console.error('Workout generation error:', error);
      throw new Error('Failed to generate workout plan');
    }
  }
  // Step 1: Detailed natural-language workout plan
  static async generateDetailedWorkoutPlan(userProfile, preferences, workoutDaysPerWeek, workoutType) {
    const prompt = this.buildDetailedWorkoutPrompt(userProfile, preferences, workoutDaysPerWeek, workoutType);

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert fitness trainer. Generate varied, evidence-based workout plans based on user profile. Workouts must adapt to goals, equipment, and level."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // more consistent output
      top_p: 0.8,
      max_tokens: 1000 // GPT-3.5-turbo is more concise
    });

    return response.choices[0].message.content.trim();
  }
  // Step 2: Convert natural-language plan → JSON
  static async convertPlanToJSON(detailedPlan, workoutType) {
    const conversionPrompt = `
Convert this workout into structured JSON for a fitness app.

DETAILED PLAN:
${detailedPlan}

REQUIREMENTS:
- Return ONLY a valid JSON array with 6-8 exercises maximum
- Each entry: {name, type, sets, reps, restTime, exerciseType, muscleGroups, equipment, instructions, tips}
- CRITICAL: type must be EXACTLY one of: "warmup", "exercise", "cooldown" - NO OTHER VALUES!
- CRITICAL: exerciseType must be EXACTLY one of: "compound", "accessory", "isolation", "warmup", "cooldown", "core" - NO OTHER VALUES!
- Rest in seconds (e.g. 90, 120)
- Include 1-2 warmup exercises, 4-5 main exercises, 1 cooldown exercise
- Keep instructions and tips short (1-2 items each)
- Select exercises from available equipment
- Ensure variety, avoid repeating identical templates

EXAMPLE FORMAT:
[
  {
    "name": "Push-ups",
    "type": "exercise",
    "sets": 3,
    "reps": "12",
    "restTime": 90,
    "exerciseType": "compound",
    "muscleGroups": ["chest", "shoulders", "triceps"],
    "equipment": ["bodyweight"],
    "instructions": ["Start in plank position", "Lower body", "Push up"],
    "tips": ["Keep core tight", "Full range of motion"]
  }
]

Return ONLY the JSON array, no explanations, no markdown, no code blocks.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a JSON generator. Always return valid JSON arrays."
        },
        {
          role: "user",
          content: conversionPrompt
        }
      ],
      temperature: 0.1, // very stable JSON output
      max_tokens: 1200 // GPT-3.5-turbo is more concise
    });

    let jsonData = response.choices[0].message.content.trim();

    // Clean markdown if model wraps output in code blocks
    if (jsonData.startsWith('```')) {
      jsonData = jsonData.replace(/```json|```/g, '').trim();
    }

    // Additional cleaning for common issues
    jsonData = jsonData.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');

    // Try to fix incomplete JSON by adding missing closing brackets
    if (jsonData.startsWith('[') && !jsonData.endsWith(']')) {
      // Count opening and closing brackets
      const openBrackets = (jsonData.match(/\[/g) || []).length;
      const closeBrackets = (jsonData.match(/\]/g) || []).length;
      const openBraces = (jsonData.match(/\{/g) || []).length;
      const closeBraces = (jsonData.match(/\}/g) || []).length;
      
      // Add missing closing brackets
      if (openBrackets > closeBrackets) {
        jsonData += ']';
      }
      if (openBraces > closeBraces) {
        jsonData += '}';
      }
    }

    // Additional fix: if JSON is still incomplete, try to find the last complete exercise
    if (!jsonData.endsWith(']') && jsonData.includes('}')) {
      const lastCompleteExercise = jsonData.lastIndexOf('}');
      if (lastCompleteExercise > 0) {
        jsonData = jsonData.substring(0, lastCompleteExercise + 1) + ']';
      }
    }

    try {
      const parsed = JSON.parse(jsonData);
      
      // Validate that each exercise has required fields and valid enums
      if (Array.isArray(parsed)) {
        const validTypes = ['warmup', 'exercise', 'cooldown'];
        const validExerciseTypes = ['compound', 'accessory', 'isolation', 'warmup', 'cooldown', 'core'];
        
        for (const exercise of parsed) {
          if (!validTypes.includes(exercise.type)) {
            exercise.type = 'exercise'; // Default to exercise
          }
          if (!validExerciseTypes.includes(exercise.exerciseType)) {
            exercise.exerciseType = 'compound'; // Default to compound
          }
        }
      }
      
      return parsed;
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw response:', jsonData);
      throw new Error('Failed to parse workout JSON from AI response');
    }
  }

  // Build detailed workout generation prompt
  static buildDetailedWorkoutPrompt(userProfile, preferences, workoutDaysPerWeek, workoutType) {
    const goals = Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : 'general fitness';
    const equipment = Array.isArray(userProfile.availableEquipment) ? userProfile.availableEquipment.join(', ') : 'bodyweight';
    const preferredExercises = Array.isArray(preferences?.preferredExercises) ? preferences.preferredExercises.join(', ') : 'None specified';
    const dislikedExercises = Array.isArray(preferences?.dislikedExercises) ? preferences.dislikedExercises.join(', ') : 'None specified';

    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    const trainingLevel = userProfile.fitnessLevel.toLowerCase();
    const workoutSplit = userProfile.workoutSplit || 'custom';
    const ageConsiderations = this.getAgeConsiderations(userProfile.age);

    // Evidence-based parameters
    const volume = this.VOLUME_TARGETS[primaryGoal];
    const rir = this.RIR_TARGETS[primaryGoal];

    return `
USER PROFILE:
- Age: ${userProfile.age} (${ageConsiderations})
- Weight: ${userProfile.weight} kg, Height: ${userProfile.height} cm
- Gender: ${userProfile.gender}
- Goal: ${primaryGoal}
- Level: ${trainingLevel}
- Days/week: ${workoutDaysPerWeek}
- Time per session: ${userProfile.timePerWorkout} minutes
- Split: ${workoutSplit}
- Equipment: ${equipment}
- Preferences: Likes [${preferredExercises}], Dislikes [${dislikedExercises}]

PROGRAMMING RULES:
- Weekly sets target: ${volume.optimal} (range ${volume.min}–${volume.max})
- RIR targets: Compounds ${rir.compounds}, Accessories ${rir.accessories}, Isolation ${rir.isolation}
- Adjust intensity/volume by level:
  - Beginner → 2–3 sets/exercise, reps 8–15
  - Intermediate → 3–4 sets/exercise, reps 6–12
  - Advanced → 4–5 sets/exercise, reps 3–12
- Rest: Compounds ${trainingLevel === 'advanced' ? '180-300' : trainingLevel === 'intermediate' ? '120-180' : '90-120'}s, Accessories ${trainingLevel === 'advanced' ? '120-180' : trainingLevel === 'intermediate' ? '90-120' : '60-90'}s

WORKOUT STRUCTURE:
- 5-min warm-up
- ${trainingLevel === 'advanced' ? '6–8' : trainingLevel === 'intermediate' ? '5–6' : '4–5'} main exercises per session
- 10-min cooldown/stretch

GOAL-SPECIFIC NOTES:
- Hypertrophy: Emphasize variety of rep ranges (6–12), progress load weekly
- Strength: Lower reps (3–6), more compound focus, longer rests
- Fat Loss: Circuits, supersets, shorter rests (45–75s), optional cardio finishers
- General Fitness: Balanced approach, moderate reps, include cardio if time allows

IMPORTANT:
- Must adapt to available equipment: ${equipment}
- Avoid disliked exercises: ${dislikedExercises}
- Prefer these exercises if possible: ${preferredExercises}
- Do not return the same template repeatedly. Change accessory/isolation exercises across users.

OUTPUT:
Write a clear natural-language workout plan (warm-up, main lifts, cooldown) that follows these rules and is ready to be converted into JSON.`;
  }

  // Determine primary goal for programming
  static determinePrimaryGoal(goals) {
    if (!Array.isArray(goals) || goals.length === 0) return 'general_fitness';
    const goalMap = {
      'build muscle': 'hypertrophy',
      'lose weight': 'fat_loss',
      'increase strength': 'strength',
      'general fitness': 'general_fitness',
      'improve endurance': 'general_fitness'
    };
    return goalMap[goals[0]] || 'general_fitness';
  }

  // Age-specific adjustments
  static getAgeConsiderations(age) {
    if (age < 18) return 'teen - emphasize technique and safety';
    if (age >= 60) return 'older adult - conservative loading, longer rests, focus on mobility';
    if (age >= 40) return 'mature adult - joint-friendly approach, longer warm-ups';
    return 'prime training age';
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

  // Determine primary goal from user's goal array
  static determinePrimaryGoal(goals) {
    if (!Array.isArray(goals) || goals.length === 0) return 'general_fitness';
    
    const goalMap = {
      'build-muscle': 'hypertrophy',
      'strength': 'strength',
      'lose-weight': 'fat_loss',
      'improve-endurance': 'general_fitness',
      'general-fitness': 'general_fitness'
    };
    
    // Find the first matching goal
    for (const goal of goals) {
      if (goalMap[goal]) {
        return goalMap[goal];
      }
    }
    
    return 'general_fitness';
  }

  // Generate template-based workout (fallback when AI fails)
  static generateTemplateWorkout(userProfile, preferences, workoutDaysPerWeek, workoutType) {
    const primaryGoal = this.determinePrimaryGoal(userProfile.goals);
    const equipment = userProfile.availableEquipment || ['bodyweight'];
    
    // Template workouts based on goals and equipment
    const templates = {
      'hypertrophy': this.getHypertrophyTemplate(equipment),
      'strength': this.getStrengthTemplate(equipment),
      'fat_loss': this.getFatLossTemplate(equipment),
      'general_fitness': this.getGeneralFitnessTemplate(equipment)
    };
    
    return templates[primaryGoal] || templates['general_fitness'];
  }

  static getHypertrophyTemplate(equipment) {
    return [
      {
        name: "Push-ups",
        type: "exercise",
        sets: 3,
        reps: "12-15",
        restTime: 90,
        exerciseType: "compound",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["bodyweight"],
        instructions: [
          "Start in plank position",
          "Lower your body until chest nearly touches floor",
          "Push back up to starting position"
        ],
        tips: [
          "Keep your core engaged",
          "Maintain straight body alignment"
        ]
      },
      {
        name: "Squats",
        type: "exercise",
        sets: 3,
        reps: "12-15",
        restTime: 90,
        exerciseType: "compound",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["bodyweight"],
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower down as if sitting in a chair",
          "Return to standing position"
        ],
        tips: [
          "Keep knees behind toes",
          "Maintain upright torso"
        ]
      },
      {
        name: "Lunges",
        type: "exercise",
        sets: 3,
        reps: "10 each leg",
        restTime: 60,
        exerciseType: "compound",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["bodyweight"],
        instructions: [
          "Step forward with one leg",
          "Lower your hips until both knees are bent",
          "Push back to starting position"
        ],
        tips: [
          "Keep front knee over ankle",
          "Maintain balance"
        ]
      },
      {
        name: "Plank",
        type: "exercise",
        sets: 3,
        reps: "30-60 seconds",
        restTime: 60,
        exerciseType: "core",
        muscleGroups: ["core", "shoulders"],
        equipment: ["bodyweight"],
        instructions: [
          "Start in push-up position",
          "Hold position with straight body",
          "Engage core throughout"
        ],
        tips: [
          "Keep hips level",
          "Breathe normally"
        ]
      }
    ];
  }

  static getStrengthTemplate(equipment) {
    return [
      {
        name: "Push-ups",
        type: "exercise",
        sets: 4,
        reps: "8-12",
        restTime: 120,
        exerciseType: "compound",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["bodyweight"],
        instructions: [
          "Start in plank position",
          "Lower your body until chest nearly touches floor",
          "Push back up to starting position"
        ],
        tips: [
          "Focus on controlled movement",
          "Full range of motion"
        ]
      },
      {
        name: "Squats",
        type: "exercise",
        sets: 4,
        reps: "8-12",
        restTime: 120,
        exerciseType: "compound",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["bodyweight"],
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower down as if sitting in a chair",
          "Return to standing position"
        ],
        tips: [
          "Keep knees behind toes",
          "Maintain upright torso"
        ]
      }
    ];
  }

  static getFatLossTemplate(equipment) {
    return [
      {
        name: "Burpees",
        type: "exercise",
        sets: 3,
        reps: "10-15",
        restTime: 60,
        exerciseType: "compound",
        muscleGroups: ["full-body"],
        equipment: ["bodyweight"],
        instructions: [
          "Start standing",
          "Drop to push-up position",
          "Do a push-up",
          "Jump feet to hands",
          "Jump up with arms overhead"
        ],
        tips: [
          "Maintain steady pace",
          "Focus on form over speed"
        ]
      },
      {
        name: "Mountain Climbers",
        type: "exercise",
        sets: 3,
        reps: "20-30",
        restTime: 45,
        exerciseType: "compound",
        muscleGroups: ["core", "legs", "shoulders"],
        equipment: ["bodyweight"],
        instructions: [
          "Start in plank position",
          "Alternate bringing knees to chest",
          "Maintain plank position"
        ],
        tips: [
          "Keep hips level",
          "Quick but controlled movement"
        ]
      }
    ];
  }

  static getGeneralFitnessTemplate(equipment) {
    return [
      {
        name: "Push-ups",
        type: "exercise",
        sets: 3,
        reps: "10-12",
        restTime: 60,
        exerciseType: "compound",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: ["bodyweight"],
        instructions: [
          "Start in plank position",
          "Lower your body until chest nearly touches floor",
          "Push back up to starting position"
        ],
        tips: [
          "Keep your core engaged",
          "Maintain straight body alignment"
        ]
      },
      {
        name: "Squats",
        type: "exercise",
        sets: 3,
        reps: "12-15",
        restTime: 60,
        exerciseType: "compound",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: ["bodyweight"],
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower down as if sitting in a chair",
          "Return to standing position"
        ],
        tips: [
          "Keep knees behind toes",
          "Maintain upright torso"
        ]
      }
    ];
  }

  // Generate comprehensive plan explanation
  static async generatePlanExplanation(userProfile, preferences, workoutSchedule, nutritionPlan, recentWorkouts) {
    try {
      // For now, let's return a hardcoded example to show the format
      const exampleOverview = `# YOUR PROGRAM BREAKDOWN

**Why This Split Works for You:**
Test, I've chosen the PPL (Push-Pull-Legs) split for you because it optimally targets different muscle groups each day, allowing for maximum recovery and muscle growth. With your goal of building muscle, this split ensures you're hitting each muscle group twice per week with adequate rest between sessions.

## DETAILED WORKOUT BREAKDOWN

**PUSH DAY:**
- **Chest Development**: "We're targeting your chest with incline barbell press for upper chest development, flat barbell press for overall mass, and dips for lower chest definition. These exercises will build thickness and width across your entire chest."
- **Shoulder Development**: "Your delts get hit with overhead press for front delts, lateral raises for side delts, and rear delt flyes for posterior development. This creates that 3D shoulder look and balanced development."
- **Tricep Development**: "We're building your triceps with close-grip bench press, overhead tricep extensions, and tricep dips. These exercises will add serious size to your arms and improve your pressing strength."

**PULL DAY:**
- **Back Development**: "Your back gets comprehensive work with pull-ups for width, barbell rows for thickness, and deadlifts for overall strength. We're building that V-taper and developing your posterior chain."
- **Bicep Development**: "Your biceps get targeted with barbell curls, hammer curls, and preacher curls. This combination hits both heads of the bicep for maximum growth and peak development."

**LEGS DAY:**
- **Quad Development**: "We're building your quads with back squats for overall development, leg press for mass, and Bulgarian split squats for unilateral strength. These exercises will add serious size to your thighs."
- **Hamstring Development**: "Your hamstrings get hit with Romanian deadlifts, leg curls, and stiff-leg deadlifts. This builds the back of your legs and improves your posterior chain strength."
- **Glute Development**: "We're targeting your glutes with hip thrusts, glute bridges, and walking lunges for power and aesthetics. Strong glutes improve your squat and deadlift performance."
- **Calf Development**: "Your calves get worked with standing calf raises and seated calf raises. This targets both the gastrocnemius and soleus for complete calf development."

## EXERCISE PROGRESSION STRATEGY

**Week 1-2**: "We start with lighter weights to perfect your form and establish baseline strength. Focus on learning proper technique."
**Week 3-4**: "We increase weight by 5-10lbs on major lifts and add volume. You'll start feeling stronger and more confident."
**Month 2**: "We introduce advanced techniques like drop sets and supersets. This is where the real growth happens."
**Month 3+**: "We implement periodization with deload weeks every 4th week. This prevents overtraining and ensures continued progress."

## NUTRITION STRATEGY

**Your Calorie Target**: "At ${nutritionPlan ? nutritionPlan.dailyCalorieTarget : 'your target'} calories, we're in a caloric surplus to support your muscle building goals."

**Macro Breakdown**:
- **Protein**: "${nutritionPlan ? nutritionPlan.macroTargets.protein : 'Your protein'}g daily for muscle repair and growth - this is your most important macro"
- **Carbs**: "${nutritionPlan ? nutritionPlan.macroTargets.carbs : 'Your carb'}g daily for workout energy and recovery - fuel your training"
- **Fats**: "${nutritionPlan ? nutritionPlan.macroTargets.fat : 'Your fat'}g daily for hormone production and joint health - don't neglect these"

## WEEKLY SCHEDULE BREAKDOWN

**Monday - Push Day**: "We're hitting chest, shoulders, and triceps with incline press, overhead press, and close-grip press. Focus on controlled movements and mind-muscle connection."
**Tuesday - Pull Day**: "We're targeting back and biceps with pull-ups, barbell rows, and barbell curls. Pay attention to scapular retraction and full range of motion."
**Wednesday - Legs Day**: "We're working quads, hamstrings, and glutes with squats, Romanian deadlifts, and hip thrusts. Emphasize proper depth and controlled tempo."
**Thursday - Push Day**: "We're developing chest, shoulders, and triceps with flat press, lateral raises, and tricep dips. Focus on progressive overload."
**Friday - Pull Day**: "We're building back and biceps with deadlifts, cable rows, and hammer curls. Concentrate on full range of motion and proper form."
**Saturday - Legs Day**: "We're strengthening legs with leg press, leg curls, and calf raises. Emphasize controlled tempo and muscle contraction."
**Sunday - Rest Day**: "Active recovery or complete rest for optimal recovery. Growth happens when you're resting."

## EXPECTED RESULTS TIMELINE

**Weeks 1-2**: "You'll notice improved energy, better form, and initial strength gains. Your body is adapting to the new stimulus."
**Month 1**: "Expect visible muscle definition, increased strength, and better workout endurance. You'll start seeing changes in the mirror."
**Month 2-3**: "You'll see significant muscle growth, improved body composition, and enhanced performance. This is where the magic happens."
**Month 4+**: "Continued muscle development, advanced strength levels, and refined physique. You'll be stronger and more muscular than ever."

## SUCCESS STRATEGIES

**Form Cues**:
- **Squats**: "Keep your chest up, core tight, and drive through your heels. Don't let your knees cave in."
- **Bench Press**: "Retract your scapula, maintain arch, and control the eccentric. Keep your feet planted."
- **Deadlifts**: "Keep the bar close, neutral spine, and drive your hips forward. Don't round your back."

**Recovery Protocol**:
- "Get 7-9 hours of sleep nightly for optimal recovery. This is when your muscles grow."
- "Stay hydrated with at least 1 gallon of water daily. Dehydration kills performance."
- "Take rest days seriously - growth happens during recovery, not during the workout."

**Progression Tracking**:
- "Increase weight when you can complete all sets with perfect form. Form always comes first."
- "Track your workouts to ensure consistent progression. What gets measured gets improved."
- "Listen to your body and adjust intensity as needed. Overtraining is counterproductive."

Test, this program is designed specifically for your goals and will deliver results if you stay consistent. Trust the process, focus on progressive overload, and prioritize recovery. You've got this!`;

      return exampleOverview;
    } catch (error) {
      console.error('Error generating plan explanation:', error);
      return "I've created a personalized fitness plan tailored to your goals and preferences. Your workout schedule focuses on progressive training with your chosen split, while your nutrition plan supports your fitness objectives with optimal macro distribution. Stay consistent and you'll see great results!";
    }
  }

  // Generate personalized meal plan
  static async generateMealPlan(userProfile, dailyCalorieTarget, dietaryRestrictions = [], allergies = []) {
    try {
      const prompt = this.buildMealPrompt(userProfile, dailyCalorieTarget, dietaryRestrictions, allergies);
      
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
        temperature: 0.3,
        max_tokens: 1200
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

      // Additional cleaning for common issues
      cleanedResponse = cleanedResponse.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');

      // Parse the JSON response
      const meals = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!Array.isArray(meals)) {
        throw new Error('Invalid response format');
      }

      // Validate meal types
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      for (const meal of meals) {
        if (!validMealTypes.includes(meal.mealType)) {
          meal.mealType = 'snack'; // Default to snack
        }
      }

      return meals;
    } catch (error) {
      console.error('AI meal generation failed, using template meals:', error.message);
      return this.generateTemplateMeals(userProfile, dailyCalorieTarget);
    }
  }

  // Generate template-based meals (fallback when AI fails)
  static generateTemplateMeals(userProfile, dailyCalorieTarget) {
    const caloriesPerMeal = Math.round(dailyCalorieTarget / 4); // 4 meals
    
    return [
      {
        name: "Protein Oatmeal",
        description: "High-protein breakfast to start your day",
        calories: caloriesPerMeal,
        protein: Math.round(caloriesPerMeal * 0.25 / 4), // 25% protein
        carbs: Math.round(caloriesPerMeal * 0.55 / 4), // 55% carbs
        fat: Math.round(caloriesPerMeal * 0.20 / 9), // 20% fat
        fiber: 8,
        ingredients: [
          "1 cup rolled oats",
          "1 scoop protein powder",
          "1 banana",
          "1 tbsp almond butter"
        ],
        instructions: [
          "Cook oats with water or milk",
          "Mix in protein powder",
          "Top with banana and almond butter"
        ],
        prepTime: 10,
        servings: 1,
        mealType: "breakfast",
        dietaryTags: ["high-protein", "fiber-rich"]
      },
      {
        name: "Grilled Chicken Salad",
        description: "Lean protein with fresh vegetables",
        calories: caloriesPerMeal,
        protein: Math.round(caloriesPerMeal * 0.30 / 4), // 30% protein
        carbs: Math.round(caloriesPerMeal * 0.40 / 4), // 40% carbs
        fat: Math.round(caloriesPerMeal * 0.30 / 9), // 30% fat
        fiber: 6,
        ingredients: [
          "4 oz grilled chicken breast",
          "Mixed greens",
          "Cherry tomatoes",
          "Cucumber",
          "Olive oil dressing"
        ],
        instructions: [
          "Grill chicken breast",
          "Chop vegetables",
          "Mix with greens",
          "Add dressing"
        ],
        prepTime: 15,
        servings: 1,
        mealType: "lunch",
        dietaryTags: ["high-protein", "low-carb"]
      },
      {
        name: "Salmon with Sweet Potato",
        description: "Omega-3 rich dinner with complex carbs",
        calories: caloriesPerMeal,
        protein: Math.round(caloriesPerMeal * 0.30 / 4), // 30% protein
        carbs: Math.round(caloriesPerMeal * 0.45 / 4), // 45% carbs
        fat: Math.round(caloriesPerMeal * 0.25 / 9), // 25% fat
        fiber: 5,
        ingredients: [
          "5 oz salmon fillet",
          "1 medium sweet potato",
          "Steamed broccoli",
          "Lemon"
        ],
        instructions: [
          "Bake salmon with lemon",
          "Roast sweet potato",
          "Steam broccoli",
          "Serve together"
        ],
        prepTime: 25,
        servings: 1,
        mealType: "dinner",
        dietaryTags: ["omega-3", "complex-carbs"]
      },
      {
        name: "Greek Yogurt with Berries",
        description: "Protein-rich snack with antioxidants",
        calories: Math.round(caloriesPerMeal * 0.5), // Smaller snack
        protein: Math.round(caloriesPerMeal * 0.35 / 4), // Higher protein %
        carbs: Math.round(caloriesPerMeal * 0.45 / 4),
        fat: Math.round(caloriesPerMeal * 0.20 / 9),
        fiber: 4,
        ingredients: [
          "1 cup Greek yogurt",
          "1/2 cup mixed berries",
          "1 tbsp honey",
          "Almonds"
        ],
        instructions: [
          "Scoop yogurt into bowl",
          "Top with berries",
          "Drizzle with honey",
          "Add almonds"
        ],
        prepTime: 5,
        servings: 1,
        mealType: "snack",
        dietaryTags: ["high-protein", "antioxidants"]
      }
    ];
  }

  // Build comprehensive meal generation prompt
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

Return ONLY a valid JSON array with this exact structure:
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

CRITICAL RULES:
- mealType must be EXACTLY one of: "breakfast", "lunch", "dinner", "snack" - NO OTHER VALUES!
- Return ONLY the JSON array, no explanations, no markdown, no code blocks
- Ensure all JSON is properly formatted with double quotes
- Include 4-6 meals total covering all meal types`;
  }

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
}

module.exports = OpenAIService;
