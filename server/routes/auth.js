const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cgpa, startDate } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      cgpa: cgpa || null,
      startDate: startDate ? new Date(startDate) : new Date()
    });

    // Create empty progress document for this user
    await Progress.create({ userId: user._id });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cgpa: user.cgpa,
        startDate: user.startDate,
        targetCompanies: user.targetCompanies
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cgpa: user.cgpa,
        startDate: user.startDate,
        targetCompanies: user.targetCompanies
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// PATCH /api/auth/profile (update profile)
router.patch('/profile', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    const { name, cgpa, targetCompanies, startDate } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (cgpa !== undefined) updates.cgpa = cgpa;
    if (targetCompanies) updates.targetCompanies = targetCompanies;
    if (startDate) updates.startDate = new Date(startDate);

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cgpa: user.cgpa,
        startDate: user.startDate,
        targetCompanies: user.targetCompanies
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
