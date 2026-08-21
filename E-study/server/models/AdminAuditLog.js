const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema(
    {
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, enum: ['admin_created', 'admin_deactivated', 'admin_reactivated', 'admin_deleted', 'promoted_to_super_admin', 'demoted_to_admin'], required: true },
        details: { type: String, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
