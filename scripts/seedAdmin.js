const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Drop the conflicting username index if it exists
    const collection = mongoose.connection.db.collection('users');
    const indexes = await collection.indexes();
    const usernameIndex = indexes.find(index => index.key.username);
    
    if (usernameIndex) {
      await collection.dropIndex('username_1');
      console.log('Dropped legacy username index');
    }

    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Test@1234', 12);
    
    const adminUser = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
