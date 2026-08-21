const express = require('express');
const router = express.Router();
const { submitSuggestion, getSuggestions } = require('../controllers/suggestionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitSuggestion);
router.get('/', protect, admin, getSuggestions);

module.exports = router;
