const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    default: 'Software Engineer',
    trim: true
  },
  status: {
    type: String,
    enum: ['saved', 'applied', 'oa', 'interview', 'offer', 'rejected'],
    default: 'saved'
  },
  link: { type: String, trim: true, default: '' },
  notes: { type: String, default: '' },
  salary: { type: String, default: '' },      // e.g. "12 LPA"
  appliedDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
