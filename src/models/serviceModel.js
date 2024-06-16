const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  url: String,
  lastAlert: Date,
  alertCount: Number,
  assignedTo: String,
  isAcknowledged: { type: Boolean, default: false },
  stakeholders: [String], // New field for stakeholder emails
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
