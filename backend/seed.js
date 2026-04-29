/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');

const User    = require('./models/User');
const Blogger = require('./models/Blogger');
const Review  = require('./models/Review');
const Ad      = require('./models/Ad');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI topilmadi'); process.exit(1); }

/* ─── Helpers ─────────────────────────────────────────────── */
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* ─── 15 ta blogger ma'lumoti ─────────────────────────────── */
const BLOGGERS = [
  {
    user: { firstName: 'Sardor',      lastName: 'Raximov',       email: 'sardor@seed.uz',      phone: '+998901000001' },
    blog: {
      handle: 'sardortech', bio: 'Texnologiya, dasturlash va startaplar haqida qiziqarli kontentlar',
      platforms: ['youtube'], socialLinks: { youtube: 'https://youtube.com/@sardortech' },
      categories: ['Tech'], services: ['Video', 'Live'],
      followers: 450000, followersRange: '100K-500K', engagementRate: 8.4,
      pricing: { post: 2500000, story: 800000, reel: 1500000, video: 3500000, live: 5000000, unboxing: 2000000 },
      language: ['uz', 'ru'], gender: 'male',
      audienceAge: '18–34', audienceGender: '72% erkak, 28% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 45, completedCampaigns: 43, totalEarnings: 95000000 },
    },
  },
  {
    user: { firstName: 'Nilufar',     lastName: 'Hasanova',      email: 'nilufar@seed.uz',     phone: '+998901000002' },
    blog: {
      handle: 'nilufarlife', bio: 'Hayot, moda va go\'zallik borasida ilhomlantiradigan kontentlar',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/nilufarlife' },
      categories: ['Lifestyle'], services: ['Post', 'Story', 'Reel'],
      followers: 320000, followersRange: '100K-500K', engagementRate: 6.2,
      pricing: { post: 1800000, story: 600000, reel: 1200000, video: 2500000, live: 3000000, unboxing: 1500000 },
      language: ['uz'], gender: 'female',
      audienceAge: '20–35', audienceGender: '15% erkak, 85% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 38, completedCampaigns: 37, totalEarnings: 72000000 },
    },
  },
  {
    user: { firstName: 'Kamola',      lastName: 'Ergasheva',     email: 'kamola@seed.uz',      phone: '+998901000003' },
    blog: {
      handle: 'kamola_beauty', bio: 'Go\'zallik sirlari, pardoz usullari va yangi trendlar',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/kamola_beauty' },
      categories: ['Beauty'], services: ['Post', 'Story', 'Reel', 'Unboxing'],
      followers: 280000, followersRange: '100K-500K', engagementRate: 9.1,
      pricing: { post: 1500000, story: 500000, reel: 1100000, video: 2200000, live: 2800000, unboxing: 1300000 },
      language: ['uz', 'ru'], gender: 'female',
      audienceAge: '18–32', audienceGender: '8% erkak, 92% ayol',
      location: 'Samarqand', isVerified: true,
      stats: { totalCampaigns: 60, completedCampaigns: 58, totalEarnings: 85000000 },
    },
  },
  {
    user: { firstName: 'Ulugbek',     lastName: 'Nazarov',       email: 'ulugbek@seed.uz',     phone: '+998901000004' },
    blog: {
      handle: 'foody_uz', bio: 'O\'zbek va dunyo taomlari receptlari va taomxonalar sharhi',
      platforms: ['tiktok'], socialLinks: { tiktok: 'https://tiktok.com/@foody_uz' },
      categories: ['Food'], services: ['Video', 'Story', 'Reel'],
      followers: 195000, followersRange: '100K-500K', engagementRate: 11.3,
      pricing: { post: 900000, story: 350000, reel: 700000, video: 1500000, live: 2000000, unboxing: 1000000 },
      language: ['uz'], gender: 'male',
      audienceAge: '22–40', audienceGender: '45% erkak, 55% ayol',
      location: 'Toshkent', isVerified: false,
      stats: { totalCampaigns: 22, completedCampaigns: 20, totalEarnings: 18000000 },
    },
  },
  {
    user: { firstName: 'Jorabek',     lastName: 'Meliqoziyev',   email: 'jorabek@seed.uz',     phone: '+998901000005' },
    blog: {
      handle: 'jorabek_sport', bio: 'Sport, fitnes va sog\'lom hayot tarzi',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/jorabek_sport' },
      categories: ['Sports'], services: ['Post', 'Story', 'Reel', 'Live'],
      followers: 1500000, followersRange: '1M+', engagementRate: 14.5,
      pricing: { post: 15000000, story: 5000000, reel: 10000000, video: 20000000, live: 25000000, unboxing: 12000000 },
      language: ['uz', 'ru', 'en'], gender: 'male',
      audienceAge: '16–35', audienceGender: '80% erkak, 20% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 120, completedCampaigns: 118, totalEarnings: 1500000000 },
    },
  },
  {
    user: { firstName: 'Diyorbek',    lastName: 'Yuldashev',     email: 'diyorbek@seed.uz',    phone: '+998901000006' },
    blog: {
      handle: 'diyorbek_music', bio: 'O\'zbek zamonaviy musiqasi, kontsertlar va yangi chiqishlar',
      platforms: ['youtube'], socialLinks: { youtube: 'https://youtube.com/@diyorbek_music' },
      categories: ['Music'], services: ['Video', 'Post', 'Live'],
      followers: 800000, followersRange: '500K-1M', engagementRate: 10.2,
      pricing: { post: 3500000, story: 1200000, reel: 2500000, video: 6000000, live: 8000000, unboxing: 3000000 },
      language: ['uz'], gender: 'male',
      audienceAge: '16–30', audienceGender: '55% erkak, 45% ayol',
      location: 'Toshkent', isVerified: false,
      stats: { totalCampaigns: 35, completedCampaigns: 33, totalEarnings: 120000000 },
    },
  },
  {
    user: { firstName: 'Gulnora',     lastName: 'Karimova',      email: 'gulnora@seed.uz',     phone: '+998901000007' },
    blog: {
      handle: 'gulnora_fashion', bio: 'Moda trendlari, kiyim kombinatsiyalari va stil maslahatlari',
      platforms: ['tiktok'], socialLinks: { tiktok: 'https://tiktok.com/@gulnora_fashion' },
      categories: ['Lifestyle'], services: ['Post', 'Story', 'Reel'],
      followers: 250000, followersRange: '100K-500K', engagementRate: 7.8,
      pricing: { post: 1200000, story: 450000, reel: 900000, video: 1800000, live: 2200000, unboxing: 1100000 },
      language: ['uz', 'ru'], gender: 'female',
      audienceAge: '18–30', audienceGender: '12% erkak, 88% ayol',
      location: 'Buxoro', isVerified: true,
      stats: { totalCampaigns: 50, completedCampaigns: 49, totalEarnings: 58000000 },
    },
  },
  {
    user: { firstName: 'Azizbek',     lastName: 'Qodirov',       email: 'azizbek@seed.uz',     phone: '+998901000008' },
    blog: {
      handle: 'azizbek_gaming', bio: 'Gaming dunyosining yangiliklari, o\'yin sharhlari va turnirlar',
      platforms: ['youtube'], socialLinks: { youtube: 'https://youtube.com/@azizbek_gaming' },
      categories: ['Gaming'], services: ['Video', 'Live', 'Post'],
      followers: 1200000, followersRange: '1M+', engagementRate: 12.7,
      pricing: { post: 5000000, story: 1800000, reel: 3500000, video: 8000000, live: 10000000, unboxing: 4500000 },
      language: ['uz', 'ru'], gender: 'male',
      audienceAge: '14–28', audienceGender: '88% erkak, 12% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 80, completedCampaigns: 78, totalEarnings: 400000000 },
    },
  },
  {
    user: { firstName: 'Shahnoza',    lastName: 'Yusupova',      email: 'shahnoza@seed.uz',    phone: '+998901000009' },
    blog: {
      handle: 'shahnoza_travel', bio: 'O\'zbekiston va dunyo bo\'ylab sayohat tajribalari va maslahatlari',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/shahnoza_travel' },
      categories: ['Travel'], services: ['Post', 'Story', 'Reel'],
      followers: 600000, followersRange: '500K-1M', engagementRate: 9.5,
      pricing: { post: 4000000, story: 1500000, reel: 3000000, video: 6000000, live: 7500000, unboxing: 3500000 },
      language: ['uz', 'en'], gender: 'female',
      audienceAge: '22–45', audienceGender: '40% erkak, 60% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 65, completedCampaigns: 63, totalEarnings: 250000000 },
    },
  },
  {
    user: { firstName: 'Bekzod',      lastName: 'Tursunov',      email: 'bekzod@seed.uz',      phone: '+998901000010' },
    blog: {
      handle: 'bekzod_edu', bio: 'Ta\'lim, xorijda o\'qish va kasbiy rivojlanish haqida',
      platforms: ['youtube'], socialLinks: { youtube: 'https://youtube.com/@bekzod_edu' },
      categories: ['Education'], services: ['Video', 'Live', 'Post'],
      followers: 350000, followersRange: '100K-500K', engagementRate: 8.0,
      pricing: { post: 2800000, story: 900000, reel: 2000000, video: 4500000, live: 5500000, unboxing: 2500000 },
      language: ['uz', 'ru', 'en'], gender: 'male',
      audienceAge: '16–30', audienceGender: '50% erkak, 50% ayol',
      location: 'Toshkent', isVerified: false,
      stats: { totalCampaigns: 30, completedCampaigns: 28, totalEarnings: 85000000 },
    },
  },
  {
    user: { firstName: 'Sarvar',      lastName: 'Xolmatov',      email: 'sarvar@seed.uz',      phone: '+998901000011' },
    blog: {
      handle: 'sarvar_tech', bio: 'IT yangiliklari, gadjetlar va dasturiy ta\'minot sharhlari',
      platforms: ['telegram'], socialLinks: { telegram: 'https://t.me/sarvar_tech' },
      categories: ['Tech'], services: ['Post', 'Story'],
      followers: 200000, followersRange: '100K-500K', engagementRate: 7.5,
      pricing: { post: 2200000, story: 700000, reel: 1500000, video: 3000000, live: 4000000, unboxing: 2000000 },
      language: ['uz', 'ru'], gender: 'male',
      audienceAge: '20–40', audienceGender: '78% erkak, 22% ayol',
      location: 'Namangan', isVerified: true,
      stats: { totalCampaigns: 28, completedCampaigns: 27, totalEarnings: 60000000 },
    },
  },
  {
    user: { firstName: 'Nodira',      lastName: 'Alieva',        email: 'nodira@seed.uz',      phone: '+998901000012' },
    blog: {
      handle: 'nodira_beauty', bio: 'Tabiiy go\'zallik mahsulotlari va terini parvarish qilish sirlari',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/nodira_beauty' },
      categories: ['Beauty'], services: ['Post', 'Story', 'Unboxing', 'Reel'],
      followers: 180000, followersRange: '100K-500K', engagementRate: 10.5,
      pricing: { post: 1300000, story: 450000, reel: 1000000, video: 2000000, live: 2500000, unboxing: 1200000 },
      language: ['uz'], gender: 'female',
      audienceAge: '18–35', audienceGender: '5% erkak, 95% ayol',
      location: 'Farg\'ona', isVerified: false,
      stats: { totalCampaigns: 25, completedCampaigns: 24, totalEarnings: 32000000 },
    },
  },
  {
    user: { firstName: 'Salohiddin',  lastName: 'Mirzakbarov',   email: 'salohiddin@seed.uz',  phone: '+998901000013' },
    blog: {
      handle: 'salohiddin_fit', bio: 'Fitnes, badantarbiya va sport ovqatlanishi bo\'yicha mutaxassis maslahatlar',
      platforms: ['instagram'], socialLinks: { instagram: 'https://instagram.com/salohiddin_fit' },
      categories: ['Sports'], services: ['Post', 'Story', 'Reel', 'Live'],
      followers: 900000, followersRange: '500K-1M', engagementRate: 13.2,
      pricing: { post: 6000000, story: 2000000, reel: 4500000, video: 9000000, live: 12000000, unboxing: 5000000 },
      language: ['uz', 'ru'], gender: 'male',
      audienceAge: '18–40', audienceGender: '75% erkak, 25% ayol',
      location: 'Toshkent', isVerified: true,
      stats: { totalCampaigns: 95, completedCampaigns: 94, totalEarnings: 560000000 },
    },
  },
  {
    user: { firstName: 'Asadbek',     lastName: 'Salimov',       email: 'asadbek@seed.uz',     phone: '+998901000014' },
    blog: {
      handle: 'asadbek_gamer', bio: 'Mobile va PC o\'yinlari, gaming yangiliklari va live streamlar',
      platforms: ['telegram'], socialLinks: { telegram: 'https://t.me/asadbek_gamer' },
      categories: ['Gaming'], services: ['Post', 'Video', 'Live'],
      followers: 500000, followersRange: '100K-500K', engagementRate: 11.0,
      pricing: { post: 3000000, story: 1000000, reel: 2200000, video: 5000000, live: 6500000, unboxing: 2800000 },
      language: ['uz', 'ru'], gender: 'male',
      audienceAge: '14–30', audienceGender: '90% erkak, 10% ayol',
      location: 'Andijon', isVerified: false,
      stats: { totalCampaigns: 40, completedCampaigns: 38, totalEarnings: 115000000 },
    },
  },
  {
    user: { firstName: 'Ozodbek',     lastName: 'Doniyorov',     email: 'ozodbek@seed.uz',     phone: '+998901000015' },
    blog: {
      handle: 'ozodbek_teach', bio: 'Ingliz tili, IELTS va xorijiy universitetlarga qabul haqida',
      platforms: ['youtube'], socialLinks: { youtube: 'https://youtube.com/@ozodbek_teach' },
      categories: ['Education'], services: ['Video', 'Live'],
      followers: 300000, followersRange: '100K-500K', engagementRate: 8.5,
      pricing: { post: 2600000, story: 850000, reel: 1800000, video: 4000000, live: 5000000, unboxing: 2300000 },
      language: ['uz', 'en'], gender: 'male',
      audienceAge: '15–28', audienceGender: '48% erkak, 52% ayol',
      location: 'Toshkent', isVerified: false,
      stats: { totalCampaigns: 20, completedCampaigns: 19, totalEarnings: 50000000 },
    },
  },
];

/* ─── Review mualliflari ──────────────────────────────────── */
const REVIEWERS = [
  { firstName: 'Ahmad',   lastName: 'Yusupov',    email: 'ahmad@seed.uz',  phone: '+998901000101', role: 'user' },
  { firstName: 'Malika',  lastName: 'Toshmatova', email: 'malika@seed.uz', phone: '+998901000102', role: 'user' },
  { firstName: 'Bobur',   lastName: 'Islamov',    email: 'bobur@seed.uz',  phone: '+998901000103', role: 'business' },
];

/* ─── Review shablonlari ──────────────────────────────────── */
const REVIEW_TEMPLATES = [
  { rating: 5, comment: 'Ajoyib bloger! Reklama natijasi juda yaxshi bo\'ldi, auditoriya juda aktiv.' },
  { rating: 5, comment: 'Professional munosabat, o\'z vaqtida yetkazdi. Yana ishlashni xohlaymiz!' },
  { rating: 4, comment: 'Yaxshi natija ko\'rdik, biroq biroz kechikdi. Umuman olganda tavsiya etamiz.' },
  { rating: 5, comment: 'Eng yaxshi blogerlardan biri. Brendimizni to\'g\'ri tanishtirdi.' },
  { rating: 4, comment: 'Kontenti sifatli, auditoriyasi faol. Narxi mos keldi.' },
  { rating: 5, comment: 'Reklamadan so\'ng sotuvlarimiz 3 barobar ko\'tarildi. Rahmat!' },
  { rating: 4, comment: 'Xabar almashish qulay, tez javob berdi. Natija kutganidan zo\'r.' },
  { rating: 5, comment: 'Har tomonlama professional! Kontenti haqiqiy va tabiiy chiqdi.' },
  { rating: 3, comment: 'Yaxshi ish qildi, lekin biroz ko\'proq kreativlik kerak edi.' },
  { rating: 5, comment: 'Auditoriyasi maqsadli, reklama aniq odamlarga yetdi. Super!' },
];

/* ═══════════════════════════════════════════════════════════ */
async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB ulandi');

    /* ── 1. Eski seed ma'lumotlarini o'chirish ── */
    const seedEmails = [
      ...BLOGGERS.map(b => b.user.email),
      ...REVIEWERS.map(r => r.email),
      'biz1@seed.uz', 'biz2@seed.uz',
    ];

    const oldUsers = await User.find({ email: { $in: seedEmails } });
    const oldUserIds = oldUsers.map(u => u._id);

    const oldBloggers = await Blogger.find({ user: { $in: oldUserIds } });
    const oldBloggerIds = oldBloggers.map(b => b._id);

    if (oldBloggerIds.length) {
      await Review.deleteMany({
        $or: [
          { blogger: { $in: oldBloggerIds } },
          { reviewer: { $in: oldUserIds } },
        ],
      });
      await Blogger.deleteMany({ _id: { $in: oldBloggerIds } });
    }
    if (oldUserIds.length) {
      await Ad.deleteMany({ user: { $in: oldUserIds } });
      await User.deleteMany({ _id: { $in: oldUserIds } });
    }

    console.log('🗑️   Eski seed ma\'lumotlari tozalandi');

    /* ── 2. Reviewer userlar ── */
    const reviewerDocs = await Promise.all(
      REVIEWERS.map(r => User.create({ ...r, password: 'Seed@123456' }))
    );
    console.log(`👥  ${reviewerDocs.length} ta reviewer yaratildi`);

    /* ── 3. Blogger userlar + profillari ── */
    const createdBloggers = [];

    for (const item of BLOGGERS) {
      const userDoc = await User.create({
        ...item.user,
        password: 'Seed@123456',
        role: 'blogger',
        isVerified: item.blog.isVerified,
      });

      const blogDoc = await Blogger.create({
        user: userDoc._id,
        ...item.blog,
      });

      createdBloggers.push({ user: userDoc, blogger: blogDoc });
    }
    console.log(`🎤  ${createdBloggers.length} ta blogger yaratildi`);

    /* ── 4. Reviewlar (har bloggerga 2–3 ta) ── */
    let reviewCount = 0;

    for (let i = 0; i < createdBloggers.length; i++) {
      const { blogger } = createdBloggers[i];
      const count = (i % 3 === 0) ? 3 : 2;   // 0,3,6,9,12 → 3 ta; qolganlar → 2 ta

      // reviewerlarni aylanma tarzda ishlatish
      const usedReviewers = [];
      for (let j = 0; j < count; j++) {
        const reviewer = reviewerDocs[(i + j) % reviewerDocs.length];
        if (usedReviewers.includes(reviewer._id.toString())) continue;
        usedReviewers.push(reviewer._id.toString());

        const tpl = REVIEW_TEMPLATES[(i * 2 + j) % REVIEW_TEMPLATES.length];

        try {
          await Review.create({
            blogger:  blogger._id,
            reviewer: reviewer._id,
            rating:   tpl.rating,
            comment:  tpl.comment,
          });
          reviewCount++;
        } catch (e) {
          // unique constraint xatosi bo'lsa o'tkazib yuborish
          if (e.code !== 11000) throw e;
        }
      }
    }
    console.log(`⭐  ${reviewCount} ta sharh yaratildi`);

    /* ── 5. Test e'lonlar (2 blogger + 2 biznes) ── */
    const sardor  = createdBloggers[0];   // sardortech  – YouTube/Tech
    const nilufar = createdBloggers[1];   // nilufarlife – Instagram/Lifestyle
    const kamola  = createdBloggers[2];   // kamola_beauty – Instagram/Beauty
    const jorabek = createdBloggers[4];   // jorabek_sport – Instagram/Sports

    // Biznes userlar
    const biz1 = await User.create({ firstName: 'Shirin', lastName: 'Zavodi', email: 'biz1@seed.uz', phone: '+998901000201', password: 'Seed@123456', role: 'business' });
    const biz2 = await User.create({ firstName: 'Texno', lastName: 'Market', email: 'biz2@seed.uz', phone: '+998901000202', password: 'Seed@123456', role: 'business' });

    await Ad.insertMany([
      /* ── 1. Blogger e'loni: Sardor – YouTube Tech ── */
      {
        user: sardor.user._id, type: 'blogger',
        title: 'YouTube video integratsiya – Tech mahsulotlar',
        description: 'Texnologiya, gadjetlar va dasturiy ta\'minot yo\'nalishida 450K YouTube auditoriyasiga mahsulotingizni professional tarzda taqdim etaman. Organik va ishonchli kontent kafolatlanadi.',
        platforms: ['youtube'],
        services: ['Video', 'Live'],
        niche: ['Tech'],
        followersRange: '100K-500K',
        pricing: { post: 2500000, story: 800000, video: 3500000 },
        portfolio: 'https://youtube.com/@sardortech',
        location: 'Toshkent',
        phone: '+998901000001',
        status: 'approved',
      },
      /* ── 2. Blogger e'loni: Nilufar – Instagram Lifestyle ── */
      {
        user: nilufar.user._id, type: 'blogger',
        title: 'Instagram Post & Story – Lifestyle & Fashion',
        description: 'Hayot, moda va go\'zallik yo\'nalishida 320K Instagram auditoriyamga brendingizni estetik va ilhomlantiruvchi tarzda yetkazaman. Story, Reel va feed postlar taklif etaman.',
        platforms: ['instagram'],
        services: ['Post', 'Story', 'Reel'],
        niche: ['Lifestyle', 'Beauty'],
        followersRange: '100K-500K',
        pricing: { post: 1800000, story: 600000, video: 2500000 },
        portfolio: 'https://instagram.com/nilufarlife',
        location: 'Toshkent',
        phone: '+998901000002',
        status: 'approved',
      },
      /* ── 3. Biznes e'loni: Shirin Zavodi ── */
      {
        user: biz1._id, type: 'business',
        companyName: 'Shirin Zavodi',
        contactPerson: 'Shirin Zavodi',
        businessType: 'Manufacturing',
        productName: 'Shirin Premium konfet liniyasi',
        productDescription: 'Yangi premium konfet kolleksiyamiz – tabiiy ingredientlar, zamonaviy qadoqlash. Bayramlik sovg\'alar uchun ideal. Narxi 25 000 so\'mdan boshlanadi.',
        targetPlatforms: ['instagram', 'youtube'],
        bloggerTypesNeeded: ['Food', 'Lifestyle', 'Any'],
        targetAudience: '25–45 yosh, Toshkent va viloyatlar, oilali xaridorlar',
        budget: { range: '3M-5M' },
        campaignDuration: '1 oy',
        campaignGoal: 'Yangi mahsulot tanishtirish va sotuv oshirish',
        requirements: 'Kamida 100K obunachilik, food yoki lifestyle nishasi',
        location: 'Toshkent',
        phone: '+998901000201',
        status: 'approved',
      },
      /* ── 4. Biznes e'loni: Texno Market ── */
      {
        user: biz2._id, type: 'business',
        companyName: 'Texno Market',
        contactPerson: 'Texno Market',
        businessType: 'Retail',
        productName: 'Samsung Galaxy S25 Ultra',
        productDescription: 'Eng so\'nggi Samsung flagmani – AI kamera, titanium korpus, 200MP. Rasmiy distribyutor sifatida chegirmali narxda taklif etamiz. Unboxing va sharh videolari uchun qurilma bepul beriladi.',
        targetPlatforms: ['youtube', 'instagram', 'telegram'],
        bloggerTypesNeeded: ['Tech', 'Any'],
        targetAudience: '18–40 yosh, gadjet ishqibozlari, yuqori daromadli segment',
        budget: { range: '5M-10M' },
        campaignDuration: '2 hafta',
        campaignGoal: 'Sotuv, brend taniqliligini oshirish',
        requirements: 'Tech yo\'nalishidagi bloger, 200K+ obunachilik, YouTube yoki Instagram',
        location: 'Toshkent',
        phone: '+998901000202',
        status: 'approved',
      },
    ]);

    console.log('📢  4 ta test e\'lon yaratildi');
    console.log('\n✅  Seed muvaffaqiyatli yakunlandi!');
    console.log('   Bloggerlarning emaili: sardor@seed.uz ... ozodbek@seed.uz');
    console.log('   Parol: Seed@123456');

  } catch (err) {
    console.error('❌  Xatolik:', err.message);
    throw err;
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
