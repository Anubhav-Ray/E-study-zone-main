const Handshake = require('../models/Handshake');
const User = require('../models/User');

// @desc    Send handshake request to trainer
// @route   POST /api/handshakes/request/:trainerId
// @access  Private (Learner only)
exports.sendRequest = async (req, res) => {
    try {
        if (req.user.role !== 'learner') {
            return res.status(401).json({ message: 'Only learners can send requests' });
        }

        const trainerId = req.params.trainerId;
        const exists = await Handshake.findOne({ learnerId: req.user._id, trainerId });

        if (exists) {
            return res.status(400).json({ message: 'Request already sent or connection exists' });
        }

        const handshake = await Handshake.create({
            learnerId: req.user._id,
            trainerId,
            status: 'pending'
        });

        res.status(201).json(handshake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get requests for trainer
// @route   GET /api/handshakes/my-requests
// @access  Private (Trainer only)
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Handshake.find({ trainerId: req.user._id })
            .populate('learnerId', 'name email uniqueId learnerProfile');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Respond to request (Accept/Reject)
// @route   PUT /api/handshakes/:id
// @access  Private (Trainer only)
exports.respondToRequest = async (req, res) => {
    try {
        const handshake = await Handshake.findById(req.params.id);

        if (!handshake) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (handshake.trainerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        handshake.status = req.body.status; // 'accepted' or 'rejected'
        const updated = await handshake.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my connections (For Learner)
// @route   GET /api/handshakes/my-connections
// @access  Private (Learner only)
exports.getMyConnections = async (req, res) => {
    try {
        const connections = await Handshake.find({ learnerId: req.user._id, status: 'accepted' })
            .populate('trainerId', 'name email uniqueId trainerProfile');
        res.json(connections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
