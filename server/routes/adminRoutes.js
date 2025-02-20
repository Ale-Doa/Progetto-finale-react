const express = require('express');
const router = express.Router();
const { getAdminDashboard, updateMembership } = require('../controllers/adminController');

router.get('/dashboard', getAdminDashboard);
router.post('/update-membership', updateMembership);

module.exports = router;