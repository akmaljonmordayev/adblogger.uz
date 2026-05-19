/**
 * Bazadan role='user' bo'lgan barcha foydalanuvchilarni o'chirish
 * Ishlatish: node scripts/deleteRegularUsers.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB ga ulandi');

  const count = await User.countDocuments({ role: 'user' });
  console.log(`📊 Topildi: ${count} ta oddiy foydalanuvchi (role='user')`);

  if (count === 0) {
    console.log('✅ O\'chiradigan foydalanuvchi yo\'q');
    process.exit(0);
  }

  const result = await User.deleteMany({ role: 'user' });
  console.log(`🗑️  O'chirildi: ${result.deletedCount} ta foydalanuvchi`);
  console.log('✅ Bajarildi');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Xato:', err.message);
  process.exit(1);
});
