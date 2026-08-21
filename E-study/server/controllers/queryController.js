const Query = require('../models/Query');

// @desc    Learner fire a query to trainer
// @route   POST /api/queries
// @access  Private (Learner only)
exports.askQuery = async (req, res) => {
    try {
        const { trainerId, question } = req.body;
        const query = await Query.create({
            learnerId: req.user._id,
            trainerId,
            question
        });
        res.status(201).json(query);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get queries for a trainer
// @route   GET /api/queries/trainer
// @access  Private (Trainer only)
exports.getTrainerQueries = async (req, res) => {
    try {
        const queries = await Query.find({ trainerId: req.user._id })
            .populate('learnerId', 'name email uniqueId');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get queries for a learner
// @route   GET /api/queries/learner
// @access  Private (Learner only)
exports.getLearnerQueries = async (req, res) => {
    try {
        const queries = await Query.find({ learnerId: req.user._id })
            .populate('trainerId', 'name email uniqueId');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Trainer respond to query
// @route   PUT /api/queries/:id
// @access  Private (Trainer only)
exports.respondToQuery = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        if (query.trainerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        query.answer = req.body.answer || query.answer;
        query.status = req.body.status || 'resolved';
        query.updatedAt = Date.now();

        const updated = await query.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
