/**
 * Migration: Set applicationStatus = 'approved' for all existing users
 * who don't have this field yet.
 *
 * Run once: node backend/scripts/migrateApplicationStatus.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const result = await User.updateMany(
    { applicationStatus: { $exists: false } },
    { $set: { applicationStatus: 'approved' } }
  );

  console.log(`Migration done. Updated: ${result.modifiedCount} users.`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
