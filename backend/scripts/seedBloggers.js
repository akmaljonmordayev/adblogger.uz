/**
 * Bloggerlarni tozalab, 10 ta yangi blogger qo'shish skripti
 * Ishlatish: node backend/scripts/seedBloggers.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User     = require('../models/User');
require('../models/Category'); // Blogger hook uchun kerak
const Blogger  = require('../models/Blogger');

// ─── 10 ta blogger ma'lumoti ──────────────────────────────────────────────
const BLOGGERS_DATA = [
  {
    user: {
      firstName: 'Jasur',
      lastName:  'Karimov',
      email:     'jasur.karimov@gmail.com',
      phone:     '+998901234561',
      password:  'password123',
      gender:    'male',
      avatar:    'https://i.pravatar.cc/300?img=11',
    },
    blogger: {
      handle:         'jasurtech',
      bio:            "O'zbekistondagi yetakchi tech bloger. Smartfonlar, gadgetlar va dasturiy ta'minot haqida chuqur tahlillar qilaman. 5+ yil tajriba.",
      platforms:      ['instagram', 'youtube', 'telegram'],
      socialLinks: {
        instagram: 'https://instagram.com/jasurtech',
        youtube:   'https://youtube.com/@jasurtech',
        telegram:  'https://t.me/jasurtech',
      },
      followers:      520000,
      followersRange: '500K-1M',
      engagementRate: 4.8,
      categories:     ['Tech', 'Gaming'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Live'],
      pricing: {
        post:  2500000,
        story: 1200000,
        reel:  3500000,
        video: 8000000,
        live:  5000000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '18-35',
      audienceGender: '75% erkak',
      rating:         4.9,
      reviewCount:    124,
      isVerified:     true,
      stats: { totalCampaigns: 87, completedCampaigns: 84, totalEarnings: 450000000 },
    },
  },
  {
    user: {
      firstName: 'Malika',
      lastName:  'Yusupova',
      email:     'malika.beauty@gmail.com',
      phone:     '+998901234562',
      password:  'password123',
      gender:    'female',
      avatar:    'https://i.pravatar.cc/300?img=47',
    },
    blogger: {
      handle:         'malikabeauty',
      bio:            'Go\'zallik va moda dunyosidan eng yangi trendlar, makeup tutorial va skincare maslahatlarini ulashaman. Har kuni yangi kontent!',
      platforms:      ['instagram', 'tiktok', 'youtube'],
      socialLinks: {
        instagram: 'https://instagram.com/malikabeauty',
        tiktok:    'https://tiktok.com/@malikabeauty',
        youtube:   'https://youtube.com/@malikabeauty',
      },
      followers:      285000,
      followersRange: '100K-500K',
      engagementRate: 6.2,
      categories:     ['Beauty', 'Lifestyle'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Unboxing'],
      pricing: {
        post:     1800000,
        story:    800000,
        reel:     2200000,
        video:    5500000,
        unboxing: 4000000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '16-30',
      audienceGender: '92% ayol',
      rating:         4.8,
      reviewCount:    98,
      isVerified:     true,
      stats: { totalCampaigns: 63, completedCampaigns: 61, totalEarnings: 280000000 },
    },
  },
  {
    user: {
      firstName: 'Bobur',
      lastName:  'Rahimov',
      email:     'bobur.food@gmail.com',
      phone:     '+998901234563',
      password:  'password123',
      gender:    'male',
      avatar:    'https://i.pravatar.cc/300?img=33',
    },
    blogger: {
      handle:         'boburfoodies',
      bio:            "O'zbekiston va jahon taomlari, restoran sharhlari va sayohat vaqtidagi gastro-tajribalarni bo'lishaman. Mazali dunyo — cheksiz imkoniyatlar!",
      platforms:      ['instagram', 'youtube', 'telegram'],
      socialLinks: {
        instagram: 'https://instagram.com/boburfoodies',
        youtube:   'https://youtube.com/@boburfoodies',
        telegram:  'https://t.me/boburfoodies',
      },
      followers:      142000,
      followersRange: '100K-500K',
      engagementRate: 5.5,
      categories:     ['Food', 'Travel'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Live'],
      pricing: {
        post:  1200000,
        story: 600000,
        reel:  1800000,
        video: 4500000,
        live:  3000000,
      },
      language:       ['uz', 'ru', 'en'],
      location:       'Samarqand',
      audienceAge:    '22-40',
      audienceGender: '55% erkak',
      rating:         4.7,
      reviewCount:    76,
      isVerified:     true,
      stats: { totalCampaigns: 45, completedCampaigns: 44, totalEarnings: 160000000 },
    },
  },
  {
    user: {
      firstName: 'Zilola',
      lastName:  'Nazarova',
      email:     'zilola.edu@gmail.com',
      phone:     '+998901234564',
      password:  'password123',
      gender:    'female',
      avatar:    'https://i.pravatar.cc/300?img=44',
    },
    blogger: {
      handle:         'zilolaedu',
      bio:            "Ta'lim, shaxsiy rivojlanish va biznes sohasida amaliy bilimlarni ulashaman. IELTS, chet tillar va karera maslahatlarida 200K+ odam ishonadi.",
      platforms:      ['youtube', 'telegram', 'instagram'],
      socialLinks: {
        youtube:   'https://youtube.com/@zilolaedu',
        telegram:  'https://t.me/zilolaedu',
        instagram: 'https://instagram.com/zilolaedu',
      },
      followers:      310000,
      followersRange: '100K-500K',
      engagementRate: 7.1,
      categories:     ['Education', 'Business'],
      services:       ['Post', 'Story', 'Video', 'Live'],
      pricing: {
        post:  2000000,
        story: 900000,
        video: 6000000,
        live:  4500000,
      },
      language:       ['uz', 'en'],
      location:       'Toshkent',
      audienceAge:    '18-32',
      audienceGender: '60% ayol',
      rating:         4.9,
      reviewCount:    143,
      isVerified:     true,
      stats: { totalCampaigns: 71, completedCampaigns: 70, totalEarnings: 320000000 },
    },
  },
  {
    user: {
      firstName: 'Sardor',
      lastName:  'Toshmatov',
      email:     'sardor.sports@gmail.com',
      phone:     '+998901234565',
      password:  'password123',
      gender:    'male',
      avatar:    'https://i.pravatar.cc/300?img=15',
    },
    blogger: {
      handle:         'sardorsports',
      bio:            "Sport, fitness va sog'lom turmush tarzi haqida. Gym workout, to'g'ri ovqatlanish va motivatsiya — har kuni yangi kontent! NPC chempioni.",
      platforms:      ['instagram', 'tiktok', 'youtube'],
      socialLinks: {
        instagram: 'https://instagram.com/sardorsports',
        tiktok:    'https://tiktok.com/@sardorsports',
        youtube:   'https://youtube.com/@sardorsports',
      },
      followers:      195000,
      followersRange: '100K-500K',
      engagementRate: 8.3,
      categories:     ['Sports', 'Lifestyle'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Live'],
      pricing: {
        post:  1500000,
        story: 700000,
        reel:  2000000,
        video: 4800000,
        live:  3500000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '18-35',
      audienceGender: '70% erkak',
      rating:         4.8,
      reviewCount:    89,
      isVerified:     true,
      stats: { totalCampaigns: 52, completedCampaigns: 50, totalEarnings: 195000000 },
    },
  },
  {
    user: {
      firstName: 'Nozima',
      lastName:  'Hasanova',
      email:     'nozima.lifestyle@gmail.com',
      phone:     '+998901234566',
      password:  'password123',
      gender:    'female',
      avatar:    'https://i.pravatar.cc/300?img=48',
    },
    blogger: {
      handle:         'nozimalife',
      bio:            "Lifestyle, moda va go'zallik dunyosidan ilhomlanuvchi kontent. Kundalik hayot, sayohat va brendlar bilan hamkorlik tajribalari. 800K+ oilalik!",
      platforms:      ['instagram', 'tiktok'],
      socialLinks: {
        instagram: 'https://instagram.com/nozimalife',
        tiktok:    'https://tiktok.com/@nozimalife',
      },
      followers:      820000,
      followersRange: '500K-1M',
      engagementRate: 5.9,
      categories:     ['Lifestyle', 'Beauty'],
      services:       ['Post', 'Story', 'Reel', 'Unboxing'],
      pricing: {
        post:     3500000,
        story:    1800000,
        reel:     5000000,
        unboxing: 6000000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '16-28',
      audienceGender: '88% ayol',
      rating:         4.7,
      reviewCount:    167,
      isVerified:     true,
      stats: { totalCampaigns: 112, completedCampaigns: 109, totalEarnings: 720000000 },
    },
  },
  {
    user: {
      firstName: 'Alisher',
      lastName:  'Ergashev',
      email:     'alisher.biz@gmail.com',
      phone:     '+998901234567',
      password:  'password123',
      gender:    'male',
      avatar:    'https://i.pravatar.cc/300?img=12',
    },
    blogger: {
      handle:         'alisherbiznez',
      bio:            "Biznes, investitsiya va moliyaviy erkinlik haqida real gapiraman. Startup, franchise va passiv daromad — iqtisodiy mustaqillik yo'lida birga.",
      platforms:      ['youtube', 'telegram', 'instagram'],
      socialLinks: {
        youtube:   'https://youtube.com/@alisherbiznez',
        telegram:  'https://t.me/alisherbiznez',
        instagram: 'https://instagram.com/alisherbiznez',
      },
      followers:      260000,
      followersRange: '100K-500K',
      engagementRate: 6.8,
      categories:     ['Business', 'Tech'],
      services:       ['Post', 'Story', 'Video', 'Live'],
      pricing: {
        post:  2200000,
        story: 1000000,
        video: 7000000,
        live:  5500000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '22-42',
      audienceGender: '78% erkak',
      rating:         4.9,
      reviewCount:    112,
      isVerified:     true,
      stats: { totalCampaigns: 68, completedCampaigns: 67, totalEarnings: 380000000 },
    },
  },
  {
    user: {
      firstName: 'Feruza',
      lastName:  'Qodirova',
      email:     'feruza.music@gmail.com',
      phone:     '+998901234568',
      password:  'password123',
      gender:    'female',
      avatar:    'https://i.pravatar.cc/300?img=45',
    },
    blogger: {
      handle:         'feruzamusic',
      bio:            "O'zbekiston estrada va zamonaviy pop musiqasini targ'ib qilaman. Konsertlar, yulduzlar bilan uchrashuvlar va musiqa yangiliklari — har kuni jonli!",
      platforms:      ['instagram', 'tiktok', 'youtube', 'telegram'],
      socialLinks: {
        instagram: 'https://instagram.com/feruzamusic',
        tiktok:    'https://tiktok.com/@feruzamusic',
        youtube:   'https://youtube.com/@feruzamusic',
        telegram:  'https://t.me/feruzamusic',
      },
      followers:      1200000,
      followersRange: '1M+',
      engagementRate: 4.2,
      categories:     ['Music', 'Lifestyle'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Live'],
      pricing: {
        post:  5000000,
        story: 2500000,
        reel:  7000000,
        video: 15000000,
        live:  10000000,
      },
      language:       ['uz', 'ru'],
      location:       'Toshkent',
      audienceAge:    '14-35',
      audienceGender: '65% ayol',
      rating:         4.8,
      reviewCount:    234,
      isVerified:     true,
      stats: { totalCampaigns: 145, completedCampaigns: 143, totalEarnings: 1200000000 },
    },
  },
  {
    user: {
      firstName: 'Umid',
      lastName:  'Mirzayev',
      email:     'umid.travel@gmail.com',
      phone:     '+998901234569',
      password:  'password123',
      gender:    'male',
      avatar:    'https://i.pravatar.cc/300?img=17',
    },
    blogger: {
      handle:         'umidtravel',
      bio:            "Dunyo bo'ylab sayohat qilaman va har bir mamlakatning madaniyati, taomlari va yashirin joylarini ko'rsataman. 45+ mamlakat, cheksiz tajriba!",
      platforms:      ['instagram', 'youtube', 'telegram'],
      socialLinks: {
        instagram: 'https://instagram.com/umidtravel',
        youtube:   'https://youtube.com/@umidtravel',
        telegram:  'https://t.me/umidtravel',
      },
      followers:      88000,
      followersRange: '50K-100K',
      engagementRate: 7.4,
      categories:     ['Travel', 'Food'],
      services:       ['Post', 'Story', 'Reel', 'Video'],
      pricing: {
        post:  900000,
        story: 450000,
        reel:  1400000,
        video: 3500000,
      },
      language:       ['uz', 'ru', 'en'],
      location:       'Buxoro',
      audienceAge:    '22-40',
      audienceGender: '52% erkak',
      rating:         4.7,
      reviewCount:    54,
      isVerified:     false,
      stats: { totalCampaigns: 28, completedCampaigns: 27, totalEarnings: 75000000 },
    },
  },
  {
    user: {
      firstName: 'Shahlo',
      lastName:  'Rahimova',
      email:     'shahlo.gaming@gmail.com',
      phone:     '+998901234570',
      password:  'password123',
      gender:    'female',
      avatar:    'https://i.pravatar.cc/300?img=49',
    },
    blogger: {
      handle:         'shahlogamer',
      bio:            "O'zbekistondagi birinchi qiz geymer bloger! Mobile gaming, esports va gaming lifestyle haqida. Free Fire, PUBG, Mobile Legends — hammasi shu yerda!",
      platforms:      ['tiktok', 'youtube', 'telegram', 'instagram'],
      socialLinks: {
        tiktok:    'https://tiktok.com/@shahlogamer',
        youtube:   'https://youtube.com/@shahlogamer',
        telegram:  'https://t.me/shahlogamer',
        instagram: 'https://instagram.com/shahlogamer',
      },
      followers:      375000,
      followersRange: '100K-500K',
      engagementRate: 9.1,
      categories:     ['Gaming', 'Tech'],
      services:       ['Post', 'Story', 'Reel', 'Video', 'Live', 'Unboxing'],
      pricing: {
        post:     1600000,
        story:    750000,
        reel:     2500000,
        video:    5500000,
        live:     4000000,
        unboxing: 3500000,
      },
      language:       ['uz', 'ru'],
      location:       'Namangan',
      audienceAge:    '14-28',
      audienceGender: '55% erkak',
      rating:         4.8,
      reviewCount:    91,
      isVerified:     true,
      stats: { totalCampaigns: 58, completedCampaigns: 56, totalEarnings: 230000000 },
    },
  },
];

/* ─── Main ──────────────────────────────────────────────────────────── */
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB ga ulandi\n');

  /* 1. Mavjud bloggerlarni va ularning user hisoblari o'chirish */
  const existingBloggers = await Blogger.find().populate('user', 'role email');
  const bloggerUserIds   = existingBloggers.map(b => b.user?._id).filter(Boolean);

  await Blogger.deleteMany({});
  console.log(`🗑  ${existingBloggers.length} ta blogger o'chirildi`);

  if (bloggerUserIds.length > 0) {
    const delRes = await mongoose.model('User').deleteMany({
      _id: { $in: bloggerUserIds },
      role: 'blogger',
    });
    console.log(`🗑  ${delRes.deletedCount} ta blogger user o'chirildi\n`);
  }

  /* 2. Yangi bloggerlar yaratish */
  const hashedPassword = await bcrypt.hash('password123', 12);

  for (const [i, data] of BLOGGERS_DATA.entries()) {
    try {
      // User yaratish
      const user = await mongoose.model('User').create({
        firstName:         data.user.firstName,
        lastName:          data.user.lastName,
        email:             data.user.email,
        phone:             data.user.phone,
        password:          hashedPassword,
        role:              'blogger',
        avatar:            data.user.avatar,
        isActive:          true,
        isVerified:        true,
        applicationStatus: 'approved',
      });

      // Blogger profil yaratish
      const blogger = await Blogger.create({
        user:           user._id,
        handle:         data.blogger.handle,
        bio:            data.blogger.bio,
        platforms:      data.blogger.platforms,
        socialLinks:    data.blogger.socialLinks,
        followers:      data.blogger.followers,
        followersRange: data.blogger.followersRange,
        engagementRate: data.blogger.engagementRate,
        categories:     data.blogger.categories,
        services:       data.blogger.services,
        pricing:        data.blogger.pricing,
        language:       data.blogger.language,
        location:       data.blogger.location,
        audienceAge:    data.blogger.audienceAge,
        audienceGender: data.blogger.audienceGender,
        rating:         data.blogger.rating,
        reviewCount:    data.blogger.reviewCount,
        isVerified:     data.blogger.isVerified,
        isActive:       true,
        stats:          data.blogger.stats,
      });

      console.log(
        `✅ [${i + 1}/10] ${data.user.firstName} ${data.user.lastName}` +
        ` | @${blogger.handle}` +
        ` | ${data.blogger.categories.join(', ')}` +
        ` | ${data.blogger.platforms.join(', ')}` +
        ` | ${(data.blogger.followers / 1000).toFixed(0)}K followers`
      );
    } catch (err) {
      console.error(`❌ [${i + 1}] ${data.user.firstName}: ${err.message}`);
    }
  }

  console.log('\n🎉 Barcha bloggerlar muvaffaqiyatli qo\'shildi!');
  console.log('─'.repeat(50));
  console.log('Barcha userlar uchun parol: password123');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Xatolik:', err.message);
  process.exit(1);
});
