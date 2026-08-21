const Suggestion = require('../models/Suggestion');

// @desc    Submit suggestion
// @route   POST /api/suggestions
// @access  Private
exports.submitSuggestion = async (req, res) => {
    try {
        const { message } = req.body;
        const suggestion = await Suggestion.create({
            userId: req.user._id,
            message
        });
        res.status(201).json(suggestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all suggestions (Admin only)
// @route   GET /api/suggestions
// @access  Private (Admin only)
exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find().populate('userId', 'name email role');
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
