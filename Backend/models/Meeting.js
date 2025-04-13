const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingType: {
        type: String,
        required: true,
        enum: ['parents', 'students'],
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    },
    agenda: {
        type: String,
        trim: true,
        default: ''
    },
    reminders: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);