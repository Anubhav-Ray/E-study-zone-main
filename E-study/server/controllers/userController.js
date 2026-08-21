const User = require('../models/User');

// @desc    Update user basic profile
// @route   PUT /api/users/profile/basic
// @access  Private
exports.updateBasicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.basicProfile = {
                phone: req.body.phone || user.basicProfile.phone,
                city: req.body.city || user.basicProfile.city,
                state: req.body.state || user.basicProfile.state,
                address: req.body.address || user.basicProfile.address,
                gender: req.body.gender || user.basicProfile.gender,
                dob: req.body.dob || user.basicProfile.dob,
            };

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Learner Advance Profile
// @route   PUT /api/users/profile/learner
// @access  Private (Learner only)
exports.updateLearnerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user && ['learner', 'student'].includes(user.role)) {
            user.learnerProfile = {
                interests: req.body.interests || user.learnerProfile.interests,
                level: req.body.level || user.learnerProfile.level,
                remarks: req.body.remarks || user.learnerProfile.remarks,
            };

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(401).json({ message: 'Not authorized or User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Trainer Advance Profile
// @route   PUT /api/users/profile/trainer
// @access  Private (Trainer only)
exports.updateTrainerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user && ['trainer', 'faculty'].includes(user.role)) {
            user.trainerProfile = {
                expertise: req.body.expertise || user.trainerProfile.expertise,
                experience: req.body.experience || user.trainerProfile.experience,
                bio: req.body.bio || user.trainerProfile.bio,
            };

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(401).json({ message: 'Not authorized or User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all trainers (for learners to browse)
// @route   GET /api/users/trainers
// @access  Private
exports.getTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('-password');
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trainers by interest (Matching module)
// @route   GET /api/users/trainers/match
// @access  Private
exports.getMatchingTrainers = async (req, res) => {
    try {
        const learner = await User.findById(req.user._id);
        if (!learner || learner.role !== 'learner') {
            return res.status(400).json({ message: 'Only learners can access matching trainers' });
        }

        const interests = learner.learnerProfile.interests;
        
        // Find trainers whose expertise matches any of learner's interests
        const trainers = await User.find({
            role: 'trainer',
            'trainerProfile.expertise': { $in: interests }
        }).select('-password');

        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
