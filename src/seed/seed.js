require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Genre = require('../models/Genre');

const DEFAULT_GENRES = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Electronic', 'Classical', 'Reggaeton'];

const seed = async () => {
  await connectDB();

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const existingAdmin = await User.findOne({ username: adminUsername });
  if (!existingAdmin) {
    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      plan: 'premium',
    });
    console.log(`Admin user created: ${adminUsername} / ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  for (const name of DEFAULT_GENRES) {
    const exists = await Genre.findOne({ name });
    if (!exists) {
      await Genre.create({ name });
      console.log(`Genre created: ${name}`);
    }
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
