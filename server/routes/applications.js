const express = require('express');
const auth = require('../middleware/authMiddleware');
const Application = require('../models/Application');

const router = express.Router();
router.use(auth);

// GET /api/applications — list all for user
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/applications — create new
router.post('/', async (req, res) => {
  try {
    const { company, role, status, link, notes, salary, appliedDate } = req.body;
    if (!company) return res.status(400).json({ message: 'Company name is required.' });

    const app = await Application.create({
      userId: req.userId,
      company, role, status, link, notes, salary,
      appliedDate: appliedDate ? new Date(appliedDate) : null,
    });
    res.status(201).json(app);
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/applications/:id — update (status, notes, etc.)
router.patch('/:id', async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    res.json(app);
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('Delete application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
