const express = require('express');
const router = express.Router();
const { 
    updateBasicProfile, 
    updateLearnerProfile, 
    updateTrainerProfile, 
    getTrainers, 
    getMatchingTrainers 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile/basic', protect, updateBasicProfile);
router.put('/profile/learner', protect, updateLearnerProfile);
router.put('/profile/trainer', protect, updateTrainerProfile);
router.get('/trainers', protect, getTrainers);
router.get('/trainers/match', protect, getMatchingTrainers);

module.exports = router;
