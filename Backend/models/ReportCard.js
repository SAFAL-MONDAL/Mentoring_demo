const mongoose = require('mongoose');

const reportCardSchema = new mongoose.Schema({
    reg_no: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8']
    },
    report_card: {
        type: String,  // This will store the data URL of the PDF
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReportCard', reportCardSchema);