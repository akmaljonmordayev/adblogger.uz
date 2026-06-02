require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User    = require('../models/User');
require('../models/Category');
const Blogger = require('../models/Blogger');

const DATA = [
  {
    user: {
      firstName: 'Sherzod',
      lastName:  'Nazarov',
      email:     'sherzod.telegram@gmail.com',
      phone:     '+998901234571',
      avatar:    'https://i.pravatar.cc/300?img=18',
    },
    blogger: {
      handle:         'sherzodnews',
      bio:            "O'zbekistondagi eng tez yangiliklar kanali. Siyosat, iqtisodiyot va jamiyat voqealari — har kuni 50+ post. 180K+ obunachilar ishonadi.",
      platforms:      ['telegram'],
      socialLinks:    { telegram: 'https://t.me/sherzodnews' },
      followers:      185000,
      followersRange: '100K-500K',
      engagementRate: 12.4,
      categories:     ['Business', 'Education'],
      services:       ['Post', 'Story'],
      pricing:        { post: 1500000, story: 800000 },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '22-45',
      audienceGender: '68% erkak',
      rating:         4.8,
      reviewCount:    67,
      isVerified:     true,
      stats: { totalCampaigns: 43, completedCampaigns: 42, totalEarnings: 145000000 },
    },
  },
  {
    user: {
      firstName: 'Kamola',
      lastName:  'Tursunova',
      email:     'kamola.telegram@gmail.com',
      phone:     '+998901234572',
      avatar:    'https://i.pravatar.cc/300?img=46',
    },
    blogger: {
      handle:         'kamolalifestyle',
      bio:            "Telegram'dagi eng yirik lifestyle kanal. Retseptlar, hayot maslahatlari, moda va uy bezatish — barchasi bir kanalda. Har kuni jonli!",
      platforms:      ['telegram', 'instagram'],
      socialLinks:    { telegram: 'https://t.me/kamolalifestyle', instagram: 'https://instagram.com/kamolalifestyle' },
      followers:      220000,
      followersRange: '100K-500K',
      engagementRate: 10.7,
      categories:     ['Lifestyle', 'Food'],
      services:       ['Post', 'Story', 'Live'],
      pricing:        { post: 1800000, story: 900000, live: 3500000 },
      language:       ['uz'],
      location:       'Andijon',
      audienceAge:    '20-38',
      audienceGender: '85% ayol',
      rating:         4.9,
      reviewCount:    88,
      isVerified:     true,
      stats: { totalCampaigns: 55, completedCampaigns: 54, totalEarnings: 210000000 },
    },
  },
  {
    user: {
      firstName: 'Firdavs',
      lastName:  'Yoʻldoshev',
      email:     'firdavs.telegram@gmail.com',
      phone:     '+998901234573',
      avatar:    'https://i.pravatar.cc/300?img=20',
    },
    blogger: {
      handle:         'firdavstech',
      bio:            "Telegram'dagi texnologiya va dasturlash kanali. IT yangiliklar, kodlash maslahatlari, freelance va remote ish imkoniyatlari. 90K+ IT mutaxassis.",
      platforms:      ['telegram', 'youtube'],
      socialLinks:    { telegram: 'https://t.me/firdavstech', youtube: 'https://youtube.com/@firdavstech' },
      followers:      94000,
      followersRange: '50K-100K',
      engagementRate: 9.8,
      categories:     ['Tech', 'Education'],
      services:       ['Post', 'Video', 'Live'],
      pricing:        { post: 900000, video: 3200000, live: 2500000 },
      language:       ['uz', 'ru'],
      location:       'Farg\'ona',
      audienceAge:    '18-35',
      audienceGender: '82% erkak',
      rating:         4.7,
      reviewCount:    41,
      isVerified:     false,
      stats: { totalCampaigns: 22, completedCampaigns: 21, totalEarnings: 58000000 },
    },
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB ga ulandi\n');

  const hashedPassword = await bcrypt.hash('password123', 12);

  for (const [i, data] of DATA.entries()) {
    try {
      const user = await User.create({
        firstName: data.user.firstName, lastName: data.user.lastName,
        email: data.user.email, phone: data.user.phone,
        password: hashedPassword, role: 'blogger',
        avatar: data.user.avatar,
        isActive: true, isVerified: true, applicationStatus: 'approved',
      });

      const blogger = await Blogger.create({
        user: user._id, ...data.blogger, isActive: true,
      });

      console.log(
        `✅ [${i + 1}/3] ${data.user.firstName} ${data.user.lastName}` +
        ` | @${blogger.handle}` +
        ` | ${data.blogger.platforms.join(', ')}` +
        ` | ${(data.blogger.followers / 1000).toFixed(0)}K followers`
      );
    } catch (err) {
      console.error(`❌ [${i + 1}] ${data.user.firstName}: ${err.message}`);
    }
  }

  console.log('\n🎉 3 ta Telegram blogger qo\'shildi! Parol: password123');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err.message); process.exit(1); });
