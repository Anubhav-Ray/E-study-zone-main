const express = require('express');
const router = express.Router();
const { protect, superAdmin } = require('../middleware/authMiddleware');
const { getAdmins, getAuditLog, setAdminStatus, setAdminRole, deleteAdmin } = require('../controllers/adminManagementController');

router.use(protect, superAdmin);
router.get('/', getAdmins);
router.get('/audit-log', getAuditLog);
router.patch('/:id/status', setAdminStatus);
router.patch('/:id/role', setAdminRole);
router.delete('/:id', deleteAdmin);

module.exports = router;
