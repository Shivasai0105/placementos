const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Progress = require('../models/Progress');
const auth = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail, emailEnabled } = require('../utils/email');

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  cgpa: user.cgpa,
  startDate: user.startDate,
  targetCompanies: user.targetCompanies,
  isVerified: user.isVerified,
});

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true, legacyHeaders: false,
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many email requests. Try again in an hour.' },
  standardHeaders: true, legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true, legacyHeaders: false,
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', apiLimiter, auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: userPayload(user) });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, cgpa, startDate } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered. Please log in.' });

    // If email is NOT configured → auto-verify so users can log in immediately
    const autoVerify = !emailEnabled();

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      cgpa: cgpa || null,
      startDate: startDate ? new Date(startDate) : new Date(),
      isVerified: autoVerify,
    });

    await Progress.create({ userId: user._id });

    if (autoVerify) {
      // No email configured — log them in directly
      const token = signToken(user._id);
      return res.status(201).json({ token, user: userPayload(user) });
    }

    // Email IS configured — send verification link
    try {
      const vToken = user.createVerificationToken();
      await user.save({ validateBeforeSave: false });
      await sendVerificationEmail(user.email, user.name, vToken);
    } catch (emailErr) {
      // Email failed but account created — still tell them to verify
      console.warn('Verification email failed:', emailErr.message);
    }

    res.status(201).json({
      message: 'Account created! Please check your email to verify your account.',
      requiresVerification: true,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = signToken(user._id);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/auth/verify/:token ──────────────────────────────────────────────
router.get('/verify/:token', async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashed,
      verificationTokenExpire: { $gt: Date.now() },
    }).select('+verificationToken +verificationTokenExpire');

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    res.json({ token, user: userPayload(user), message: 'Email verified! You are now logged in.' });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /api/auth/resend-verification ──────────────────────────────────────
router.post('/resend-verification', emailLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+verificationToken +verificationTokenExpire');

    if (!user) return res.status(404).json({ message: 'No account found with this email.' });
    if (user.isVerified) return res.status(400).json({ message: 'Email is already verified.' });

    const token = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(user.email, user.name, token);

    res.json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Could not send email. Please try again later.' });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', emailLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+resetToken +resetTokenExpire');

    // Always respond OK — don't leak whether email exists
    if (!user) return res.json({ message: 'If that email is registered, a reset link has been sent.' });

    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user.email, user.name, token);

    res.json({ message: 'Password reset email sent. Please check your inbox.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Could not send email. Please try again later.' });
  }
});

// ─── POST /api/auth/reset-password/:token ────────────────────────────────────
router.post('/reset-password/:token', authLimiter, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpire: { $gt: Date.now() },
    }).select('+resetToken +resetTokenExpire');

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset link.' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user: userPayload(user), message: 'Password reset! You are now logged in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PATCH /api/auth/profile ──────────────────────────────────────────────────
router.patch('/profile', apiLimiter, auth, async (req, res) => {
  try {
    const { name, cgpa, targetCompanies, startDate } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (cgpa !== undefined) updates.cgpa = cgpa;
    if (targetCompanies) updates.targetCompanies = targetCompanies;
    if (startDate) updates.startDate = new Date(startDate);

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: userPayload(user) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PATCH /api/auth/password ─────────────────────────────────────────────────
router.patch('/password', apiLimiter, auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both current and new password are required.' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    const user = await User.findById(req.userId).select('+password');
    if (!user || !(await user.correctPassword(currentPassword, user.password)))
      return res.status(401).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
