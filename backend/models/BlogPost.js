const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title:   { type: String, required: [true, 'Sarlavha kiritilishi shart'], trim: true },
    slug:    { type: String, unique: true },
    excerpt: { type: String, maxlength: 300 },
    content: { type: String, required: [true, 'Kontent kiritilishi shart'] },
    coverImage: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports', 'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other'],
      required: true,
    },
    tags:     [{ type: String, trim: true, lowercase: true }],
    readTime: { type: Number, default: 5 },
    views:    { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

blogPostSchema.index({ category: 1, isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
