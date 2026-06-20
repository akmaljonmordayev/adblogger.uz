require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ DB connected');

  const admin = await User.findOne({ role: 'admin' }).select('+password');
  if (!admin) {
    console.log('❌ Admin user not found');
    process.exit(1);
  }

  admin.email = 'akmal1234@adbloger.uz';
  admin.password = '123456';
  await admin.save();

  console.log('✅ Admin updated:');
  console.log('   Email:    akmal1234@adbloger.uz');
  console.log('   Password: 123456');

  await mongoose.disconnect();
}

updateAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
