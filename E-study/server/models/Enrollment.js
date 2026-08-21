const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
        enrollmentNumber: { type: String, required: true, trim: true, uppercase: true, unique: true },
        currentSemester: { type: Number, required: true, min: 1, max: 16 },
        section: { type: String, trim: true, uppercase: true },
        batchYear: { type: Number, required: true },
        status: { type: String, enum: ['active', 'graduated', 'suspended', 'dropped'], default: 'active' }
    },
    { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
