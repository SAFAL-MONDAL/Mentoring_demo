// models/Mentorship.js
const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  slNo: {
    type: Number,
    required: true
  },
  regdNo: {
    type: String,
    required: true,
    unique: true,
    index: true // Adding index for faster searches
  },
  studentName: {
    type: String,
    required: true
  },
  mentorName: {
    type: String,
    required: true
  },
  mentorPhone: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Mentorship', mentorshipSchema);