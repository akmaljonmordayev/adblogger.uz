/**
 * Bazadagi har bir bloggerga 1-3 ta random kategoriya qo'shish.
 * Agar blogger allaqachon kategoriyaga ega bo'lsa, o'zgartirmaydi.
 * Ishlatish: node backend/scripts/assignRandomCategories.js
 * Flag --force barcha bloggerlarni qayta tasodifiy kategoriya bilan yangilaydi.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
require('../models/Category');
const Blogger  = require('../models/Blogger');

const CATEGORIES = [
  'Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports',
  'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other',
];

const FORCE = process.argv.includes('--force');

function pickRandom(arr, min = 1, max = 3) {
  const count  = Math.floor(Math.random() * (max - min + 1)) + min;
  const result = [];
  const pool   = [...arr];
  while (result.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE);
  console.log('✅ MongoDB ga ulandi\n');

  const bloggers = await Blogger.find().select('_id categories handle');
  console.log(`📋 Jami ${bloggers.length} ta blogger topildi`);

  const toUpdate = FORCE
    ? bloggers
    : bloggers.filter(b => !b.categories || b.categories.length === 0);

  console.log(`🔄 ${toUpdate.length} ta blogger yangilanadi${FORCE ? ' (--force)' : ' (bo\'sh kategoriyalar)'}\n`);

  if (toUpdate.length === 0) {
    console.log('✅ Barcha bloggerlar allaqachon kategoriyaga ega. --force flag bilan qayta ishlatish mumkin.');
    await mongoose.disconnect();
    return;
  }

  let updated = 0;
  const stats = {};

  for (const b of toUpdate) {
    const cats = pickRandom(CATEGORIES, 1, 3);
    await Blogger.findByIdAndUpdate(b._id, { categories: cats });
    cats.forEach(c => { stats[c] = (stats[c] || 0) + 1; });
    updated++;
    process.stdout.write(`\r  Yangilandi: ${updated}/${toUpdate.length}`);
  }

  console.log('\n\n📊 Kategoriya taqsimoti:');
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const bar = '█'.repeat(Math.round(count / toUpdate.length * 20));
      console.log(`  ${cat.padEnd(12)} ${bar} ${count} ta`);
    });

  console.log(`\n✅ ${updated} ta blogger muvaffaqiyatli yangilandi.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Xatolik:', err.message);
  process.exit(1);
});
