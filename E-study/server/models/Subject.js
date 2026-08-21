const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true, uppercase: true, unique: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        semester: { type: Number, required: true, min: 1, max: 16 },
        credits: { type: Number, default: 3, min: 0, max: 12 },
        facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, enum: ['theory', 'practical', 'project'], default: 'theory' },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

subjectSchema.index({ courseId: 1, semester: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
