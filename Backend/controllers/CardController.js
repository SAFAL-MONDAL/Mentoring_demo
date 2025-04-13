const ReportCard = require('../models/ReportCard');

exports.uploadReportCard = async (req, res) => {
    try {
        const { reg_no, name, semester, report_card } = req.body;

        // Validate that report_card is a data URL
        if (!report_card.startsWith('data:application/pdf;base64,')) {
            return res.status(400).json({ error: 'Invalid PDF format' });
        }

        const reportCard = new ReportCard({
            reg_no,
            name,
            semester: semester.replace(/\D/g, ''), // Store semester as a number
            report_card
        });

        await reportCard.save();
        res.status(201).json({ message: 'Report card uploaded successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Registration number already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

exports.getReportCards = async (req, res) => {
    try {
        const { reg_no, semester } = req.query;
        let query = {};

        if (reg_no) {
            query.reg_no = { $regex: reg_no, $options: 'i' };
        }
        if (semester) {
            query.semester = semester;
        }

        const reportCards = await ReportCard.find(query).sort('-uploadedAt');
        res.json(reportCards);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteReportCard = async (req, res) => {
    try {
        const reportCard = await ReportCard.findByIdAndDelete(req.params.id);
        if (!reportCard) {
            return res.status(404).json({ error: 'Report card not found' });
        }
        res.json({ message: 'Report card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};