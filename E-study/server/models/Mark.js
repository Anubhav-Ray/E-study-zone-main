const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        examName: { type: String, required: true, trim: true },
        examType: { type: String, enum: ['internal', 'mid_sem', 'end_sem', 'practical', 'assignment', 'quiz'], required: true },
        semester: { type: Number, required: true, min: 1, max: 16 },
        score: { type: Number, required: true, min: 0 },
        maximumScore: { type: Number, required: true, min: 1 },
        enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        remarks: { type: String, trim: true, maxlength: 500 }
    },
    { timestamps: true }
);

markSchema.index({ studentId: 1, subjectId: 1, examName: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
