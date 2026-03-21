const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Progress = require('../models/Progress');
const auth = require('../middleware/authMiddleware');

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
});

// ─── Rate Limiters ────────────────────────────────────────────────────────────
// Strict: 10 attempts per 15 min on login/register (brute-force prevention)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Relaxed: general limit for profile/me endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── GET /api/auth/me — Refresh current user from DB ─────────────────────────
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

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      cgpa: cgpa || null,
      startDate: startDate ? new Date(startDate) : new Date()
    });

    await Progress.create({ userId: user._id });

    const token = signToken(user._id);
    res.status(201).json({ token, user: userPayload(user) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
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

// ─── PATCH /api/auth/password ────────────────────────────────────────────────
router.patch('/password', apiLimiter, auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user || !(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save(); // triggers the bcrypt pre-save hook
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
