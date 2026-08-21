const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true, uppercase: true, unique: true },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
        durationYears: { type: Number, required: true, min: 1, max: 8 },
        totalSemesters: { type: Number, required: true, min: 1, max: 16 },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

courseSchema.index({ departmentId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
