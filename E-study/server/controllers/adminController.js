const User = require('../models/User');
const Material = require('../models/Material');
const Query = require('../models/Query');
const Suggestion = require('../models/Suggestion');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const learnersCount = await User.countDocuments({ role: 'learner' });
        const trainersCount = await User.countDocuments({ role: 'trainer' });
        const materialsCount = await Material.countDocuments();
        const queriesCount = await Query.countDocuments();
        const suggestionsCount = await Suggestion.countDocuments();

        res.json({
            users: usersCount,
            learners: learnersCount,
            trainers: trainersCount,
            materials: materialsCount,
            queries: queriesCount,
            suggestions: suggestionsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (['admin', 'super_admin'].includes(user.role)) {
                return res.status(403).json({ message: 'Administrative accounts cannot be deleted here' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
