const express = require('express');
const router = express.Router();
const { 
    sendRequest, 
    getMyRequests, 
    respondToRequest, 
    getMyConnections 
} = require('../controllers/handshakeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request/:trainerId', protect, sendRequest);
router.get('/my-requests', protect, getMyRequests);
router.put('/:id', protect, respondToRequest);
router.get('/my-connections', protect, getMyConnections);

module.exports = router;
