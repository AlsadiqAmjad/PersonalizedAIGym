const mongoose = require('mongoose');
const User = require('./models/User');
const Workout = require('./models/Workout');
const NutritionPlan = require('./models/NutritionPlan');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-ai');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await NutritionPlan.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const sampleUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        email: 'demo@example.com',
        password: 'password123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        profile: {
          age: 25,
          weight: 70,
          height: 175,
          gender: 'male',
          fitnessLevel: 'intermediate',
          goals: ['build-muscle'],
          availableEquipment: ['dumbbells', 'barbell'],
          timePerWorkout: 45,
          workoutDaysPerWeek: 4,
          workoutSplit: 'ppl'
        }
      },
      {
        email: 'coach@example.com',
        password: 'password123',
        firstName: 'Demo',
        lastName: 'Coach',
        role: 'coach',
        coachProfile: {
          specialization: ['strength-training', 'cardio'],
          experience: 5,
          bio: 'Experienced fitness coach specializing in strength training'
        }
      }
    ];

    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} sample users`);

    console.log('Database seeded successfully!');
    console.log('\nSample accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: demo@example.com / password123');
    console.log('Coach: coach@example.com / password123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
