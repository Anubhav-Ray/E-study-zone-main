const express = require('express');
const router = express.Router();
const { askQuery, getTrainerQueries, getLearnerQueries, respondToQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, askQuery);
router.get('/trainer', protect, getTrainerQueries);
router.get('/learner', protect, getLearnerQueries);
router.put('/:id', protect, respondToQuery);

module.exports = router;
