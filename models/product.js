const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true,
  },
  quantity: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  shipping: {
    required: false,
    type: Boolean,
  },
}, { timestamps: true });

// Middleware to automatically create a slug before saving
productSchema.pre('save', function(next) {
  if (this.name && this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
