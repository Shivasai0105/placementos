const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // tasks stored as: { "w0d0t0": true, "w0d0t1": false, ... }
  tasks: {
    type: Map,
    of: Boolean,
    default: {}
  },
  // problems stored as: { "p_p1": true, "p_p2": false, ... }
  problems: {
    type: Map,
    of: Boolean,
    default: {}
  },
  // commPrepDays stored as: { "1": true, "5": true, ... } (day number as key)
  commPrepDays: {
    type: Map,
    of: Boolean,
    default: {}
  },
  // interviewReviewed stored as: { "dsa1": true, "m3": true, ... }
  interviewReviewed: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
