const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const Subject = require('../models/Subject');

const isAcademicStaff = (user) => ['admin', 'faculty', 'trainer', 'hod', 'principal'].includes(user.role);

const canManageSubject = (user, subject) =>
    user.role === 'admin' || user.role === 'hod' || user.role === 'principal' || subject.facultyId?.toString() === user._id.toString();

exports.recordAttendance = async (req, res) => {
    try {
        const { subjectId, date, records } = req.body;
        if (!subjectId || !date || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'subjectId, date, and at least one attendance record are required' });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        if (!isAcademicStaff(req.user) || !canManageSubject(req.user, subject)) {
            return res.status(403).json({ message: 'Not authorized to mark attendance for this subject' });
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);
        const operations = records.map(({ studentId, status, remarks }) => ({
            updateOne: {
                filter: { studentId, subjectId, date: attendanceDate },
                update: { $set: { status, remarks, markedBy: req.user._id } },
                upsert: true
            }
        }));
        await Attendance.bulkWrite(operations);
        res.status(201).json({ message: 'Attendance saved', recordsSaved: records.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enterMark = async (req, res) => {
    try {
        const { studentId, subjectId, examName, examType, semester, score, maximumScore, remarks } = req.body;
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        if (!isAcademicStaff(req.user) || !canManageSubject(req.user, subject)) {
            return res.status(403).json({ message: 'Not authorized to enter marks for this subject' });
        }
        if (Number(score) > Number(maximumScore)) {
            return res.status(400).json({ message: 'Score cannot exceed maximum score' });
        }

        const mark = await Mark.findOneAndUpdate(
            { studentId, subjectId, examName },
            { studentId, subjectId, examName, examType, semester, score, maximumScore, remarks, enteredBy: req.user._id },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(mark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyAcademicStats = async (req, res) => {
    try {
        const [attendance, marks] = await Promise.all([
            Attendance.find({ studentId: req.user._id }).populate('subjectId', 'name code credits'),
            Mark.find({ studentId: req.user._id }).populate('subjectId', 'name code credits').sort({ createdAt: -1 })
        ]);

        const attendanceBySubject = new Map();
        for (const record of attendance) {
            const key = record.subjectId._id.toString();
            const item = attendanceBySubject.get(key) || {
                subject: record.subjectId,
                totalClasses: 0,
                attendedClasses: 0
            };
            item.totalClasses += 1;
            if (['present', 'late', 'excused'].includes(record.status)) item.attendedClasses += 1;
            attendanceBySubject.set(key, item);
        }

        const attendanceSummary = [...attendanceBySubject.values()].map((item) => ({
            ...item,
            percentage: Number(((item.attendedClasses / item.totalClasses) * 100).toFixed(1)),
            isLowAttendance: (item.attendedClasses / item.totalClasses) * 100 < 75
        }));
        const totalClasses = attendanceSummary.reduce((sum, item) => sum + item.totalClasses, 0);
        const attendedClasses = attendanceSummary.reduce((sum, item) => sum + item.attendedClasses, 0);
        const overallAttendance = totalClasses ? Number(((attendedClasses / totalClasses) * 100).toFixed(1)) : 0;

        const marksBySubject = new Map();
        for (const mark of marks) {
            const key = mark.subjectId._id.toString();
            const item = marksBySubject.get(key) || { subject: mark.subjectId, obtained: 0, maximum: 0, assessments: [] };
            item.obtained += mark.score;
            item.maximum += mark.maximumScore;
            item.assessments.push(mark);
            marksBySubject.set(key, item);
        }
        const markSummary = [...marksBySubject.values()].map((item) => ({
            ...item,
            percentage: item.maximum ? Number(((item.obtained / item.maximum) * 100).toFixed(1)) : 0
        }));
        const totalObtained = markSummary.reduce((sum, item) => sum + item.obtained, 0);
        const totalMaximum = markSummary.reduce((sum, item) => sum + item.maximum, 0);
        const overallMarks = totalMaximum ? Number(((totalObtained / totalMaximum) * 100).toFixed(1)) : 0;

        const healthScore = Number(((overallAttendance * 0.45) + (overallMarks * 0.55)).toFixed(1));
        const status = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : healthScore >= 40 ? 'needs_attention' : 'at_risk';

        res.json({
            attendance: { overallPercentage: overallAttendance, subjects: attendanceSummary },
            marks: { overallPercentage: overallMarks, subjects: markSummary },
            healthScore: { value: healthScore, status },
            alerts: [
                ...attendanceSummary.filter((item) => item.isLowAttendance).map((item) => `Low attendance in ${item.subject.name}`),
                ...markSummary.filter((item) => item.percentage < 40).map((item) => `Low marks in ${item.subject.name}`)
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
