const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  cgpa: { type: Number, default: null, min: 0, max: 10 },
  targetCompanies: {
    type: [String],
    default: ['Zoho', 'Freshworks', 'Persistent', 'TCS Digital', 'Infosys DSE']
  },
  startDate: { type: Date, default: Date.now },

  // ─── Email Verification ───────────────────────────────────────────────────
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  verificationTokenExpire: { type: Date, select: false },

  // ─── Password Reset ───────────────────────────────────────────────────────
  resetToken: { type: String, select: false },
  resetTokenExpire: { type: Date, select: false },

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Generate a random hex token, store its hash, return the raw token
userSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return rawToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return rawToken;
};

module.exports = mongoose.model('User', userSchema);
