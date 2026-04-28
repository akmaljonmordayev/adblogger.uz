/**
 * Database Seeder
 * Ishlatish: node utils/seeder.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const User     = require('../models/User');
const Blogger  = require('../models/Blogger');
const Ad       = require('../models/Ad');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const FAQ      = require('../models/FAQ');
const Career   = require('../models/Career');

// ── Seed Data ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Tech',      slug: 'tech',      color: '#6366f1', order: 1, isFeatured: true,  description: 'Texnologiya va gadjetlar' },
  { name: 'Lifestyle', slug: 'lifestyle', color: '#ec4899', order: 2, isFeatured: true,  description: 'Hayot tarzi va kundalik hayot' },
  { name: 'Beauty',    slug: 'beauty',    color: '#f43f5e', order: 3, isFeatured: true,  description: 'Go\'zallik va parvarish' },
  { name: 'Food',      slug: 'food',      color: '#f97316', order: 4, isFeatured: true,  description: 'Oziq-ovqat va restoranlar' },
  { name: 'Sports',    slug: 'sports',    color: '#22c55e', order: 5, isFeatured: false, description: 'Sport va fitness' },
  { name: 'Travel',    slug: 'travel',    color: '#06b6d4', order: 6, isFeatured: false, description: 'Sayohat va turizm' },
  { name: 'Education', slug: 'education', color: '#eab308', order: 7, isFeatured: false, description: 'Ta\'lim va o\'rganish' },
  { name: 'Business',  slug: 'business',  color: '#3b82f6', order: 8, isFeatured: false, description: 'Biznes va tadbirkorlik' },
  { name: 'Gaming',    slug: 'gaming',    color: '#8b5cf6', order: 9, isFeatured: false, description: 'O\'yinlar va e-sport' },
  { name: 'Music',     slug: 'music',     color: '#14b8a6', order: 10,isFeatured: false, description: 'Musiqa va san\'at' },
];

const FAQS = [
  { question: 'ADBlogger nima?', answer: 'ADBlogger — O\'zbekistondagi bloggerlar va bizneslarni birlashtiruvchi platforma. Biznes o\'z mahsulotini reklama qilmoqchi bo\'lsa, bloggerlar bilan bog\'lana oladi.', category: 'general', order: 1 },
  { question: 'Ro\'yxatdan o\'tish bepulmi?', answer: 'Ha, ro\'yxatdan o\'tish va profilni to\'ldirish mutlaqo bepul. Premium funksiyalar keyinchalik qo\'shiladi.', category: 'general', order: 2 },
  { question: 'Qanday qilib blogger bo\'lish mumkin?', answer: 'Ro\'yxatdan o\'ting, "Blogger" rolini tanlang, profilingizni to\'ldiring va tasdiqlash uchun so\'rov yuboring.', category: 'blogger', order: 1 },
  { question: 'Biznes sifatida qanday blogger topish mumkin?', answer: 'Bloggerlar bo\'limiga kiring, kategoriya va platforma bo\'yicha filtrlang, kerakli bloggerni toping va taklif yuboring.', category: 'business', order: 1 },
  { question: 'To\'lov qanday amalga oshiriladi?', answer: 'To\'lovlar blogger va biznes o\'rtasida kelishuv asosida amalga oshiriladi. Platforma to\'lovni kafolatlamaydi.', category: 'payment', order: 1 },
  { question: 'Tasdiqlangan blogger nishoni nima?', answer: 'Tasdiqlangan blogger (✓) — platformamiz tomonidan tekshirilgan va haqiqiy statistikaga ega blogger.', category: 'blogger', order: 2 },
  { question: 'E\'lon joylash uchun qancha vaqt kerak?', answer: 'E\'lon 24 soat ichida admin tomonidan ko\'rib chiqiladi va tasdiqlash/rad etish haqida xabar beriladi.', category: 'general', order: 3 },
  { question: 'Texnik muammo bo\'lsa kimga murojaat qilish kerak?', answer: 'Bog\'lanish sahifasi orqali yoki admin@adbloger.uz emailiga murojaat qilishingiz mumkin.', category: 'technical', order: 1 },
];

const CAREERS = [
  {
    title: 'Frontend Developer (React)',
    department: 'Engineering',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    description: 'ADBlogger platformasini rivojlantirish uchun tajribali React dasturchi izlaymiz.',
    requirements: ['React 18+', 'TypeScript', 'TailwindCSS', '2+ yil tajriba', 'Git'],
    benefits: ['Raqobatbardosh maosh', 'Moslashuvchan jadval', 'Masofaviy ish imkoniyati'],
    salaryRange: { min: 800, max: 1500, currency: 'USD' },
    isActive: true,
  },
  {
    title: 'Backend Developer (Node.js)',
    department: 'Engineering',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    description: 'Node.js va MongoDB bilan ishlash tajribasiga ega backend dasturchi.',
    requirements: ['Node.js', 'Express.js', 'MongoDB', 'REST API', '2+ yil tajriba'],
    benefits: ['Raqobatbardosh maosh', 'O\'sish imkoniyati', 'Jamoa faoliyatlari'],
    salaryRange: { min: 900, max: 1800, currency: 'USD' },
    isActive: true,
  },
  {
    title: 'Content Manager',
    department: 'Marketing',
    location: 'Toshkent, O\'zbekiston',
    type: 'full-time',
    description: 'ADBlogger blog va ijtimoiy tarmoqlari uchun kontent yaratish va boshqarish.',
    requirements: ['Kontent yozish tajribasi', 'SMM ko\'nikmalari', 'O\'zbek va Rus tillari'],
    benefits: ['Kreativ muhit', 'Moslashuvchan jadval'],
    salaryRange: { min: 400, max: 700, currency: 'USD' },
    isActive: true,
  },
];

// ── Main Seed Function ────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ DB connected');

  // 1. Admin user
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({
      firstName: 'Admin',
      lastName:  'ADBlogger',
      email:     process.env.ADMIN_EMAIL || 'admin@adbloger.uz',
      password:  process.env.ADMIN_PASSWORD || 'Admin@123456',
      role:      'admin',
      isVerified: true,
    });
    console.log('✅ Admin user created:', adminUser.email);
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // 2. Categories
  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }
  console.log('✅ Categories seeded (10 ta)');

  // 3. FAQs
  for (const faq of FAQS) {
    const exists = await FAQ.findOne({ question: faq.question });
    if (!exists) await FAQ.create(faq);
  }
  console.log('✅ FAQs seeded (8 ta)');

  // 4. Careers
  for (const career of CAREERS) {
    const exists = await Career.findOne({ title: career.title });
    if (!exists) await Career.create(career);
  }
  console.log('✅ Careers seeded (3 ta)');

  // 5. Sample blogger users
  const bloggerData = [
    { firstName: 'Sardor',   lastName: 'Aliyev',    email: 'sardor@test.com',   phone: '+998901111111', handle: 'sardor_tech',    platforms: ['instagram','youtube'],          categories: ['Tech','Education'],          followers: 85000,  followersRange: '50K-100K', pricing: { post: 500000, story: 250000, video: 1500000 }, rating: 4.8, isVerified: true  },
    { firstName: 'Malika',   lastName: 'Karimova',  email: 'malika@test.com',   phone: '+998902222222', handle: 'malika_beauty',  platforms: ['instagram','tiktok'],           categories: ['Beauty','Lifestyle'],        followers: 120000, followersRange: '100K-500K', pricing: { post: 800000, story: 400000, video: 2000000 }, rating: 4.9, isVerified: true  },
    { firstName: 'Jasur',    lastName: 'Toshmatov', email: 'jasur@test.com',    phone: '+998903333333', handle: 'jasur_food',     platforms: ['instagram','youtube','tiktok'], categories: ['Food','Lifestyle'],          followers: 45000,  followersRange: '10K-50K',  pricing: { post: 300000, story: 150000, video: 800000  }, rating: 4.5, isVerified: false },
    { firstName: 'Nilufar',  lastName: 'Rashidova', email: 'nilufar@test.com',  phone: '+998904444444', handle: 'nilufar_travel', platforms: ['instagram','youtube'],          categories: ['Travel','Lifestyle'],        followers: 200000, followersRange: '100K-500K', pricing: { post: 1200000, story: 600000, video: 3000000 }, rating: 4.7, isVerified: true  },
    { firstName: 'Bobur',    lastName: 'Yusupov',   email: 'bobur@test.com',    phone: '+998905555555', handle: 'bobur_sports',   platforms: ['instagram','tiktok'],           categories: ['Sports','Lifestyle'],        followers: 60000,  followersRange: '50K-100K', pricing: { post: 400000, story: 200000, video: 1000000 }, rating: 4.3, isVerified: true  },
    { firstName: 'Zulfiya',  lastName: 'Nazarova',  email: 'zulfiya@test.com',  phone: '+998906666666', handle: 'zulfiya_edu',    platforms: ['youtube','telegram'],           categories: ['Education','Business'],     followers: 35000,  followersRange: '10K-50K',  pricing: { post: 250000, story: 120000, video: 700000  }, rating: 4.6, isVerified: false },
    { firstName: 'Sherzod',  lastName: 'Mirzayev',  email: 'sherzod@test.com',  phone: '+998907777777', handle: 'sherzod_gaming', platforms: ['youtube','tiktok'],             categories: ['Gaming','Tech'],             followers: 95000,  followersRange: '50K-100K', pricing: { post: 600000, story: 300000, video: 1800000 }, rating: 4.4, isVerified: true  },
    { firstName: 'Dilorom',  lastName: 'Sultanova', email: 'dilorom@test.com',  phone: '+998908888888', handle: 'dilorom_music',  platforms: ['instagram','tiktok'],           categories: ['Music','Lifestyle'],         followers: 150000, followersRange: '100K-500K', pricing: { post: 900000, story: 450000, video: 2500000 }, rating: 4.8, isVerified: true  },
    { firstName: 'Ulugbek',  lastName: 'Hamidov',   email: 'ulugbek@test.com',  phone: '+998909999999', handle: 'ulugbek_biz',    platforms: ['youtube','telegram'],           categories: ['Business','Education'],     followers: 25000,  followersRange: '10K-50K',  pricing: { post: 200000, story: 100000, video: 600000  }, rating: 4.2, isVerified: false },
    { firstName: 'Shahnoza', lastName: 'Ergasheva', email: 'shahnoza@test.com', phone: '+998910101010', handle: 'shahnoza_life',  platforms: ['instagram','youtube','tiktok'], categories: ['Lifestyle','Beauty','Food'], followers: 320000, followersRange: '100K-500K', pricing: { post: 1500000, story: 750000, video: 4000000 }, rating: 4.9, isVerified: true  },
  ];

  const bloggerUsers = [];
  for (const bd of bloggerData) {
    let user = await User.findOne({ email: bd.email });
    if (!user) {
      user = await User.create({
        firstName: bd.firstName,
        lastName:  bd.lastName,
        email:     bd.email,
        phone:     bd.phone,
        password:  'Test@123456',
        role:      'blogger',
        isVerified: bd.isVerified,
      });
    }

    let blogger = await Blogger.findOne({ user: user._id });
    if (!blogger) {
      blogger = await Blogger.create({
        user:          user._id,
        handle:        bd.handle,
        bio:           `${bd.firstName} - professional blogger | ${bd.categories.join(', ')} nishasi`,
        platforms:     bd.platforms,
        categories:    bd.categories,
        services:      ['Post', 'Story', 'Video'],
        followers:     bd.followers,
        followersRange:bd.followersRange,
        engagementRate:parseFloat((Math.random() * 5 + 2).toFixed(1)),
        pricing:       bd.pricing,
        rating:        bd.rating,
        reviewCount:   Math.floor(Math.random() * 50 + 5),
        isVerified:    bd.isVerified,
        isActive:      true,
        location:      'Toshkent, O\'zbekiston',
      });
    }
    bloggerUsers.push({ user, blogger });
  }
  console.log(`✅ Bloggers seeded (${bloggerUsers.length} ta)`);

  // 6. Sample business users & ads
  const businessData = [
    { firstName: 'Kamol', lastName: 'Tursunov', email: 'kamol_biz@test.com', company: 'TechShop UZ' },
    { firstName: 'Lola',  lastName: 'Mirzaeva', email: 'lola_biz@test.com',  company: 'Beauty Store' },
    { firstName: 'Anvar', lastName: 'Xolmatov', email: 'anvar_biz@test.com', company: 'FoodExpress' },
  ];

  const bizUsers = [];
  for (const biz of businessData) {
    let user = await User.findOne({ email: biz.email });
    if (!user) {
      user = await User.create({
        firstName: biz.firstName,
        lastName:  biz.lastName,
        email:     biz.email,
        password:  'Test@123456',
        role:      'business',
        isVerified: true,
      });
    }
    bizUsers.push({ user, company: biz.company });
  }

  // 7. Ads
  const sampleAds = [
    {
      user:        bloggerUsers[0].user._id,
      type:        'blogger',
      title:       'Instagram post va story reklamasi',
      description: 'Tech va gadjetlar sohasida 85K+ obunachilar bilan sifatli reklama',
      platforms:   ['instagram', 'youtube'],
      services:    ['Post', 'Story', 'Video'],
      niche:       ['Tech', 'Education'],
      followersRange: '50K-100K',
      pricing:     { post: 500000, story: 250000, video: 1500000 },
      location:    'Toshkent',
      status:      'approved',
      phone:       '+998901111111',
    },
    {
      user:        bloggerUsers[1].user._id,
      type:        'blogger',
      title:       'Beauty & skincare reklama',
      description: 'Go\'zallik va parvarish mahsulotlari uchun professional kontent',
      platforms:   ['instagram', 'tiktok'],
      services:    ['Post', 'Story', 'Reel'],
      niche:       ['Beauty', 'Lifestyle'],
      followersRange: '100K-500K',
      pricing:     { post: 800000, story: 400000, video: 2000000 },
      location:    'Toshkent',
      status:      'approved',
      phone:       '+998902222222',
    },
    {
      user:        bizUsers[0].user._id,
      type:        'business',
      title:       'Tech mahsulot uchun blogger izlaymiz',
      companyName: 'TechShop UZ',
      contactPerson: 'Kamol Tursunov',
      businessType: 'Retail',
      productName:  'Samsung Galaxy S25',
      productDescription: 'Yangi Samsung smartfonini reklama qilish uchun tech blogger kerak',
      targetPlatforms: ['instagram', 'youtube'],
      bloggerTypesNeeded: ['Tech'],
      targetAudience: '18-35 yoshli yigitlar',
      budget:      { range: '3M-5M' },
      campaignDuration: '1 oy',
      campaignGoal: 'Brand awareness va sotuvlarni oshirish',
      location:    'Toshkent',
      status:      'approved',
      phone:       '+998901234567',
      email:       'kamol_biz@test.com',
    },
    {
      user:        bizUsers[1].user._id,
      type:        'business',
      title:       'Beauty mahsulotlar uchun blogger',
      companyName: 'Beauty Store',
      contactPerson: 'Lola Mirzaeva',
      businessType: 'Beauty',
      productName:  'Organic skincare to\'plami',
      productDescription: 'Tabiiy ingredientlardan tayyorlangan skincare mahsulotlar',
      targetPlatforms: ['instagram', 'tiktok'],
      bloggerTypesNeeded: ['Beauty', 'Lifestyle'],
      targetAudience: '18-40 yoshli ayollar',
      budget:      { range: '1M-3M' },
      campaignDuration: '2 hafta',
      campaignGoal: 'Mahsulot taqdimoti',
      location:    'Toshkent',
      status:      'approved',
      phone:       '+998901234568',
      email:       'lola_biz@test.com',
    },
    {
      user:        bloggerUsers[3].user._id,
      type:        'blogger',
      title:       'Travel kontent va reklama',
      description: '200K+ obunachilar — sayohat va turizm sohasida reklama',
      platforms:   ['instagram', 'youtube'],
      services:    ['Post', 'Video', 'Story'],
      niche:       ['Travel', 'Lifestyle'],
      followersRange: '100K-500K',
      pricing:     { post: 1200000, story: 600000, video: 3000000 },
      location:    'Toshkent',
      status:      'approved',
      phone:       '+998904444444',
    },
    {
      user:        bizUsers[2].user._id,
      type:        'business',
      title:       'Restoran targ\'iboti uchun blogger',
      companyName: 'FoodExpress',
      contactPerson: 'Anvar Xolmatov',
      businessType: 'Restaurant',
      productName:  'FoodExpress ilovasi',
      productDescription: 'Ovqat yetkazib berish ilovasi uchun reklama',
      targetPlatforms: ['instagram', 'tiktok'],
      bloggerTypesNeeded: ['Food', 'Lifestyle'],
      targetAudience: '18-45 yoshlilar',
      budget:      { range: '500K-1M' },
      campaignDuration: '1 hafta',
      campaignGoal: 'Ilova yuklab olishlarini oshirish',
      location:    'Toshkent',
      status:      'pending',
      phone:       '+998901234569',
    },
  ];

  for (const ad of sampleAds) {
    const exists = await Ad.findOne({ user: ad.user, title: ad.title || ad.productName });
    if (!exists) await Ad.create(ad);
  }
  console.log(`✅ Ads seeded (${sampleAds.length} ta)`);

  // 8. Blog posts
  const blogPosts = [
    {
      title:    'Instagram da reklama narxlari 2026: To\'liq qo\'llanma',
      excerpt:  'O\'zbekistonda Instagram influencer marketing narxlari va trendlari haqida to\'liq ma\'lumot.',
      content:  '<h2>Kirish</h2><p>Instagram marketing O\'zbekistonda tez rivojlanmoqda. Bu maqolada narxlar va trendlar haqida gaplashamiz.</p><h2>Narxlar</h2><p>10K-50K obunachilar: post uchun 100K-500K so\'m. 50K-100K: 500K-1M so\'m. 100K+: 1M+ so\'m.</p>',
      category: 'Business',
      tags:     ['instagram', 'reklama', 'influencer', 'marketing'],
      isPublished: true,
    },
    {
      title:    'Blogger bo\'lish uchun 10 ta muhim qadam',
      excerpt:  'Noldan boshlab professional blogger bo\'lish bo\'yicha amaliy maslahatlar.',
      content:  '<h2>1. Nishingizni toping</h2><p>Qaysi soha siz uchun qiziqarli? Tech, Beauty, Food?</p><h2>2. Kontent rejasi tuzing</h2><p>Haftasiga kamida 3-5 ta post.</p><h2>3. Sifatli kontent yarating</h2><p>Rasm va video sifatiga e\'tibor bering.</p>',
      category: 'Education',
      tags:     ['blogger', 'instagram', 'kontent', 'maslahat'],
      isPublished: true,
    },
    {
      title:    'TikTok vs Instagram: O\'zbekiston uchun qaysi biri yaxshi?',
      excerpt:  'Ikki eng mashhur platforma solishtirilmoqda — blogger va reklama beruvchilar uchun.',
      content:  '<h2>TikTok</h2><p>Tez o\'sish, yoshlar auditoriyasi. Viral bo\'lish imkoniyati yuqori.</p><h2>Instagram</h2><p>Katta auditoriya, business uchun qulay. Story va Reels muhim.</p><h2>Xulosa</h2><p>Ikkalasini ham ishlating!</p>',
      category: 'Tech',
      tags:     ['tiktok', 'instagram', 'platform', 'solishtirma'],
      isPublished: true,
    },
    {
      title:    'Influencer marketing ROI ni qanday o\'lchash mumkin?',
      excerpt:  'Reklama investitsiyangizdan qaytimni aniq o\'lchash usullari.',
      content:  '<h2>ROI nima?</h2><p>Return on Investment — sarmoyadan qaytim.</p><h2>O\'lchash usullari</h2><p>1. Promo-kod ishlatish. 2. UTM linklar. 3. Sotuvlarni kuzatish.</p>',
      category: 'Business',
      tags:     ['roi', 'marketing', 'biznes', 'tahlil'],
      isPublished: true,
    },
    {
      title:    'Telegram kanalda 50K obunachi yig\'ish sirlari',
      excerpt:  'Telegram kanalingizni noldan 50,000 obunachilikka olib chiqish strategiyasi.',
      content:  '<h2>Boshlash</h2><p>Nisha tanlash eng muhim qadam. Tor nisha = tez o\'sish.</p><h2>Kontent strategiyasi</h2><p>Kuniga 2-3 ta qimmatli post. Amaliy ma\'lumotlar ulashing.</p>',
      category: 'Education',
      tags:     ['telegram', 'kanal', 'obunachi', 'o\'sish'],
      isPublished: true,
    },
  ];

  for (const post of blogPosts) {
    const exists = await BlogPost.findOne({ title: post.title });
    if (!exists) {
      await BlogPost.create({ ...post, author: adminUser._id });
    }
  }
  console.log(`✅ Blog posts seeded (${blogPosts.length} ta)`);

  await mongoose.disconnect();
  console.log('\n🎉 Seeding tugadi!');
  console.log('─────────────────────────────────────');
  console.log('Admin: admin@adbloger.uz / Admin@123456');
  console.log('Test bloggers: sardor@test.com / Test@123456');
  console.log('Test business: kamol_biz@test.com / Test@123456');
  console.log('─────────────────────────────────────');
}

seed().catch((err) => {
  console.error('Seeder xatosi:', err);
  process.exit(1);
});
