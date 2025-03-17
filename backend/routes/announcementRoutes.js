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

router.get('/', getAnnouncements);

router.post('/', protect, admin, createAnnouncement);
router.get('/all', protect, admin, getAllAnnouncements);
router.route('/:id')
  .put(protect, admin, updateAnnouncement)
  .delete(protect, admin, deleteAnnouncement);

module.exports = router;