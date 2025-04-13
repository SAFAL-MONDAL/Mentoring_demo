const express = require('express');
const { createMeeting, getAllMeetings, getMeetingByType } = require('../controllers/meetingController');
const { uploadReportCard, getReportCards, deleteReportCard } = require('../controllers/CardController');
const router = express.Router();

router.post('/report-cards/upload', uploadReportCard);
router.get('/report-cards', getReportCards);
router.delete('/report-cards/:id', deleteReportCard);


const queryController = require('../controllers/QueryController');

router.post('/queries', queryController.submitQuery);
router.get('/queries', queryController.getAllQueries);
router.patch('/queries/:id', queryController.updateQueryStatus);
router.delete('/queries', queryController.clearAllQueries);

router.post('/meetings', createMeeting);
router.get('/meetings', getAllMeetings);
router.get('/meetings/:meetingType', getMeetingByType);

const Mentorship = require('../models/MentorList');
const multer = require('multer');
const XLSX = require('xlsx');


// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Mentorship routes
router.post('/mentorship/upload', upload.single('excelFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // Remove header row and process data
        const [headers, ...dataRows] = excelData;

        // Validate headers
        const expectedHeaders = ['Sl. No.', 'REGD. NO.', 'NAME OF THE STUDENT', 'NAME OF THE MENTOR', 'MENTOR PHONE NO'];
        if (!headers.every((header, index) => header === expectedHeaders[index])) {
            return res.status(400).json({ error: 'Invalid file format. Please use the correct template.' });
        }

        // Clear existing data
        await Mentorship.deleteMany({});

        // Process and insert new data
        const mentorshipData = [];
        const errors = [];

        dataRows.forEach((row, index) => {
            if (row.some(cell => cell !== '')) {  // Only process non-empty rows
                const [slNo, regdNo, studentName, mentorName, mentorPhone] = row;
                
                if (!slNo || !regdNo || !studentName || !mentorName || !mentorPhone) {
                    errors.push(`Row ${index + 2}: Missing required data`);
                } else {
                    mentorshipData.push({
                        slNo: Number(slNo) || index + 1,
                        regdNo: regdNo.toString(),
                        studentName: studentName.toString(),
                        mentorName: mentorName.toString(),
                        mentorPhone: mentorPhone.toString()
                    });
                }
            }
        });

        if (mentorshipData.length === 0) {
            return res.status(400).json({ error: 'No valid data found in the uploaded file', errors });
        }

        await Mentorship.insertMany(mentorshipData);

        res.status(200).json({
            message: 'Data uploaded successfully',
            count: mentorshipData.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading file: ' + error.message });
    }
});

router.get('/mentorship/student/:regdNo', async (req, res) => {
    try {
        const student = await Mentorship.findOne({ 
            regdNo: req.params.regdNo.toString() 
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Error searching student data' });
    }
});

router.get('/mentorship/all', async (req, res) => {
    try {
        const data = await Mentorship.find({}).sort('slNo');
        res.json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

router.delete('/mentorship/clear', async (req, res) => {
    try {
        await Mentorship.deleteMany({});
        res.json({ message: 'All data cleared successfully' });
    } catch (error) {
        console.error('Clear error:', error);
        res.status(500).json({ error: 'Error clearing data' });
    }
});

module.exports = router;