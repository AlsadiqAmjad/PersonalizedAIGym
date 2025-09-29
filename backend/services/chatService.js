const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatService {
  // User AI agent - answers questions about their fitness plan
  async getUserChatResponse(userMessage, userProfile, userPlans) {
    try {
      const systemPrompt = `You are a helpful AI fitness assistant for a user. You have access to their profile and plans.

User Profile:
- Name: ${userProfile.firstName} ${userProfile.lastName}
- Age: ${userProfile.profile?.age || 'Not specified'}
- Weight: ${userProfile.profile?.weight || 'Not specified'} kg
- Height: ${userProfile.profile?.height || 'Not specified'} cm
- Fitness Level: ${userProfile.profile?.fitnessLevel || 'Not specified'}
- Goals: ${userProfile.profile?.goals?.join(', ') || 'Not specified'}
- Workout Days Per Week: ${userProfile.profile?.workoutDaysPerWeek || 'Not specified'}
- Workout Split: ${userProfile.profile?.workoutSplit || 'Not specified'}

Current Plans:
- Workout Schedule: ${userPlans.workoutSchedule ? `${userPlans.workoutSchedule.splitType} split` : 'No active workout schedule'}
- Nutrition Plan: ${userPlans.nutritionPlan ? `${userPlans.nutritionPlan.dailyCalorieTarget} calories/day` : 'No active nutrition plan'}

Instructions:
- Answer questions about their fitness plan, workouts, nutrition, and goals
- Provide helpful, encouraging, and educational responses
- Keep responses concise but informative
- If you don't have specific information, suggest they check their dashboard or contact their coach
- Be supportive and motivating
- Don't provide medical advice

User Message: ${userMessage}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('User chat error:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact your coach for assistance.";
    }
  }

  // Coach AI agent - helps coaches with client management
  async getCoachChatResponse(coachMessage, clientProfile, clientPlans, coachProfile) {
    try {
      const systemPrompt = `You are an AI assistant for a fitness coach. You have access to their client's information and plans.

Coach Profile:
- Name: ${coachProfile.firstName} ${coachProfile.lastName}
- Specialization: ${coachProfile.coachProfile?.specialization?.join(', ') || 'General fitness'}
- Experience: ${coachProfile.coachProfile?.experience || 'Not specified'} years

Client Profile:
- Name: ${clientProfile.firstName} ${clientProfile.lastName}
- Age: ${clientProfile.profile?.age || 'Not specified'}
- Weight: ${clientProfile.profile?.weight || 'Not specified'} kg
- Height: ${clientProfile.profile?.height || 'Not specified'} cm
- Fitness Level: ${clientProfile.profile?.fitnessLevel || 'Not specified'}
- Goals: ${clientProfile.profile?.goals?.join(', ') || 'Not specified'}
- Workout Days Per Week: ${clientProfile.profile?.workoutDaysPerWeek || 'Not specified'}
- Workout Split: ${clientProfile.profile?.workoutSplit || 'Not specified'}

Client Plans:
- Workout Schedule: ${clientPlans.workoutSchedule ? `${clientPlans.workoutSchedule.splitType} split` : 'No active workout schedule'}
- Nutrition Plan: ${clientPlans.nutritionPlan ? `${clientPlans.nutritionPlan.dailyCalorieTarget} calories/day` : 'No active nutrition plan'}

Instructions:
- Help the coach with client management, plan adjustments, and fitness advice
- Provide professional, evidence-based recommendations
- Suggest modifications to workouts or nutrition plans when appropriate
- Help with motivation strategies and progress tracking
- Be concise and actionable in your responses
- Don't provide medical advice

Coach Message: ${coachMessage}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: coachMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Coach chat error:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  }
}

module.exports = new ChatService();
