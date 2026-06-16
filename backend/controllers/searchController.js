const Blogger   = require('../models/Blogger');
const BlogPost  = require('../models/BlogPost');
const Ad        = require('../models/Ad');
const User      = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/search?q=...&limit=5
exports.globalSearch = catchAsync(async (req, res) => {
  const q     = (req.query.q || '').trim();
  const limit = Math.min(parseInt(req.query.limit) || 5, 10);

  if (!q) return res.status(200).json({ success: true, data: { bloggers: [], blogs: [], ads: [] } });

  const regex = new RegExp(q, 'i');

  const blockedIds = await User.find({
    $or: [{ isBlocked: true }, { isFrozen: true }, { isActive: false }],
  }).distinct('_id');

  const [bloggers, blogs, ads] = await Promise.all([
    // Bloggerlar: handle, bio, categories, platforms + user firstName/lastName
    Blogger.find({
      isActive: true,
      isVerified: true,
      user: { $nin: blockedIds },
      $or: [
        { handle:     regex },
        { bio:        regex },
        { categories: regex },
        { platforms:  regex },
        { location:   regex },
      ],
    })
      .populate('user', 'firstName lastName avatar')
      .limit(limit)
      .select('handle bio categories platforms followersRange user'),

    // Bloglar: title, excerpt, tags, category
    BlogPost.find({
      status: 'approved',
      $or: [
        { title:    regex },
        { excerpt:  regex },
        { tags:     regex },
        { category: regex },
      ],
    })
      .populate('author', 'firstName lastName avatar')
      .limit(limit)
      .select('title excerpt category slug coverImage author'),

    // E'lonlar: title, description, companyName, platforms, category
    Ad.find({
      status: { $in: ['active', 'approved'] },
      $or: [
        { title:       regex },
        { description: regex },
        { companyName: regex },
        { platforms:   regex },
        { category:    regex },
      ],
    })
      .populate('user', 'firstName lastName avatar')
      .limit(limit)
      .select('title description platforms budget companyName coverImage user'),
  ]);

  // Also match user names in bloggers
  const userIds = await User.find({
    $or: [
      { firstName: regex },
      { lastName:  regex },
    ],
    _id: { $nin: blockedIds },
  }).distinct('_id');

  if (userIds.length) {
    const extraBloggers = await Blogger.find({
      isActive: true,
      isVerified: true,
      user: { $in: userIds, $nin: blockedIds },
    })
      .populate('user', 'firstName lastName avatar')
      .limit(limit)
      .select('handle bio categories platforms followersRange user');

    // Merge without duplicates
    const seen = new Set(bloggers.map(b => b._id.toString()));
    extraBloggers.forEach(b => {
      if (!seen.has(b._id.toString())) bloggers.push(b);
    });
  }

  res.status(200).json({
    success: true,
    data: {
      bloggers: bloggers.slice(0, limit),
      blogs:    blogs.slice(0, limit),
      ads:      ads.slice(0, limit),
    },
  });
});
