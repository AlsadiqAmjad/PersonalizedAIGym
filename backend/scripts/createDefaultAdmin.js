const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-ai');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'saeedalhabib@admin.com' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin
    const admin = new User({
      email: 'saeedalhabib@admin.com',
      password: 'Saeed123',
      firstName: 'Saeed',
      lastName: 'Alhabib',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('Default admin created successfully:');
    console.log('Email: saeedalhabib@admin.com');
    console.log('Password: Saeed123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createDefaultAdmin();
