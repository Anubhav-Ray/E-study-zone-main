const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Enrollment = require('../models/Enrollment');

const sendServerError = (res, error) => res.status(500).json({ message: error.message });

exports.createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('hodId', 'name email uniqueId').sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.getCourses = async (req, res) => {
    try {
        const filter = req.query.departmentId ? { departmentId: req.query.departmentId } : {};
        const courses = await Course.find(filter).populate('departmentId', 'name code').sort({ name: 1 });
        res.json(courses);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const filter = {};
        if (req.query.courseId) filter.courseId = req.query.courseId;
        if (req.query.semester) filter.semester = Number(req.query.semester);
        const subjects = await Subject.find(filter)
            .populate('courseId', 'name code')
            .populate('facultyId', 'name email uniqueId')
            .sort({ semester: 1, name: 1 });
        res.json(subjects);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.createEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.create(req.body);
        const populatedEnrollment = await enrollment.populate([
            { path: 'studentId', select: 'name email uniqueId role' },
            { path: 'courseId', select: 'name code' },
            { path: 'departmentId', select: 'name code' }
        ]);
        res.status(201).json(populatedEnrollment);
    } catch (error) {
        sendServerError(res, error);
    }
};

exports.getEnrollments = async (req, res) => {
    try {
        const filter = {};
        const staffRoles = ['admin', 'faculty', 'trainer', 'hod', 'principal'];
        // Students can only read their own enrollment record; faculty can load a class list.
        if (!staffRoles.includes(req.user.role)) {
            filter.studentId = req.user._id;
        } else if (req.query.studentId) {
            filter.studentId = req.query.studentId;
        }
        if (req.query.courseId) filter.courseId = req.query.courseId;
        if (req.query.departmentId) filter.departmentId = req.query.departmentId;
        const enrollments = await Enrollment.find(filter)
            .populate('studentId', 'name email uniqueId role')
            .populate('courseId', 'name code')
            .populate('departmentId', 'name code')
            .sort({ batchYear: -1, enrollmentNumber: 1 });
        res.json(enrollments);
    } catch (error) {
        sendServerError(res, error);
    }
};
