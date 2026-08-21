const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { recordAttendance, enterMark, getMyAcademicStats } = require('../controllers/performanceController');

router.post('/attendance', protect, recordAttendance);
router.post('/marks', protect, enterMark);
router.get('/student/me', protect, getMyAcademicStats);

module.exports = router;
