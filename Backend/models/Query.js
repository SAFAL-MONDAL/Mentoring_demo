const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['Student', 'Parent'],
    required: true
  },
  registration: {
    type: String,
    required: function() {
      return this.userType === 'Student';
    }
  },
  query: {
    type: String,
    required: true
  },
  parentType: {
    type: String,
    enum: ["Mother's", "Father's"],
    required: function() {
      return this.userType === 'Parent';
    }
  },
  parentStudentName: {
    type: String,
    required: function() {
      return this.userType === 'Parent';
    }
  },
  parentRegistration: {
    type: String,
    required: function() {
      return this.userType === 'Parent';
    }
  },
  status: {
    type: String,
    enum: ['Open', 'Solved'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Query', querySchema);