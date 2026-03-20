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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
