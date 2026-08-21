const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        date: { type: Date, required: true },
        status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
        markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        remarks: { type: String, trim: true, maxlength: 300 }
    },
    { timestamps: true }
);

attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ subjectId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
