const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get active announcements
router.get('/', getAnnouncements);

// Admin routes
router.post('/', protect, admin, createAnnouncement);
router.get('/all', protect, admin, getAllAnnouncements);
router.route('/:id')
  .put(protect, admin, updateAnnouncement)
  .delete(protect, admin, deleteAnnouncement);

module.exports = router;