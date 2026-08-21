const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createDepartment,
    getDepartments,
    createCourse,
    getCourses,
    createSubject,
    getSubjects,
    createEnrollment,
    getEnrollments
} = require('../controllers/academicController');

router.get('/departments', protect, getDepartments);
router.post('/departments', protect, admin, createDepartment);
router.get('/courses', protect, getCourses);
router.post('/courses', protect, admin, createCourse);
router.get('/subjects', protect, getSubjects);
router.post('/subjects', protect, admin, createSubject);
router.get('/enrollments', protect, getEnrollments);
router.post('/enrollments', protect, admin, createEnrollment);

module.exports = router;
