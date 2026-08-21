const User = require('../models/User');
const AdminAuditLog = require('../models/AdminAuditLog');

const privilegedRoles = ['admin', 'super_admin'];

const logChange = (actorId, targetId, action, details) =>
    AdminAuditLog.create({ actorId, targetId, action, details });

exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: { $in: privilegedRoles } })
            .select('-password')
            .sort({ role: 1, createdAt: 1 });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAuditLog = async (req, res) => {
    try {
        const days = Number.parseInt(req.query.days, 10);
        const filter = {};
        if (Number.isInteger(days) && days > 0) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            filter.createdAt = { $gte: startDate };
        }

        const logs = await AdminAuditLog.find(filter)
            .populate('actorId', 'name email uniqueId')
            .populate('targetId', 'name email uniqueId')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setAdminStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be true or false' });
        const target = await User.findById(req.params.id);
        if (!target || !privilegedRoles.includes(target.role)) return res.status(404).json({ message: 'Admin account not found' });
        if (target._id.toString() === req.user._id.toString() && !isActive) return res.status(400).json({ message: 'You cannot deactivate your own account' });
        if (target.role === 'super_admin' && !isActive) {
            const activeSuperAdmins = await User.countDocuments({ role: 'super_admin', isActive: true });
            if (activeSuperAdmins <= 1) return res.status(400).json({ message: 'At least one active super admin is required' });
        }
        target.isActive = isActive;
        await target.save();
        await logChange(req.user._id, target._id, isActive ? 'admin_reactivated' : 'admin_deactivated', `${target.name} was ${isActive ? 'reactivated' : 'deactivated'}`);
        res.json(target.toObject({ versionKey: false }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setAdminRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!privilegedRoles.includes(role)) return res.status(400).json({ message: 'Role must be admin or super_admin' });
        const target = await User.findById(req.params.id);
        if (!target || !privilegedRoles.includes(target.role)) return res.status(404).json({ message: 'Admin account not found' });
        if (target._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own administrator role' });
        }
        if (target.role === role) return res.json(target);
        if (target.role === 'super_admin' && role === 'admin') {
            const activeSuperAdmins = await User.countDocuments({ role: 'super_admin', isActive: true });
            if (target.isActive && activeSuperAdmins <= 1) return res.status(400).json({ message: 'Promote another active admin before demoting the last super admin' });
        }
        target.role = role;
        await target.save();
        await logChange(req.user._id, target._id, role === 'super_admin' ? 'promoted_to_super_admin' : 'demoted_to_admin', `${target.name} is now ${role}`);
        res.json(target.toObject({ versionKey: false }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const target = await User.findById(req.params.id);
        if (!target || target.role !== 'admin') {
            return res.status(404).json({ message: 'Admin account not found' });
        }

        await logChange(req.user._id, target._id, 'admin_deleted', `${target.name} (${target.email}) was deleted`);
        await target.deleteOne();
        res.json({ message: 'Admin account deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
