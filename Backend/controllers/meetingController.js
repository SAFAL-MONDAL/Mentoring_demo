const Meeting = require('../models/Meeting');

// Create or update meeting
exports.createMeeting = async (req, res) => {
    try {
        const { meetingType, link, date, agenda, reminders } = req.body;

        // Validate required fields
        if (!meetingType || !link || !date) {
            return res.status(400).json({
                message: 'Meeting type, link, and date are required.'
            });
        }

        // Delete existing meeting of the same type (if exists)
        await Meeting.deleteOne({ meetingType });

        // Create new meeting
        const newMeeting = new Meeting({
            meetingType,
            link,
            date: new Date(date),
            agenda: agenda || '',
            reminders: reminders || []
        });

        await newMeeting.save();

        res.status(201).json({
            message: 'Meeting saved successfully',
            data: newMeeting
        });

    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({
            message: 'Failed to save meeting',
            error: error.message
        });
    }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({
            message: 'Failed to fetch meetings',
            error: error.message
        });
    }
};

// Get meeting by type
exports.getMeetingByType = async (req, res) => {
    try {
        const { meetingType } = req.params;
        const meeting = await Meeting.findOne({ meetingType });
        
        if (!meeting) {
            return res.status(404).json({
                message: `No ${meetingType} meeting found`
            });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        res.status(500).json({
            message: 'Failed to fetch meeting',
            error: error.message
        });
    }
};