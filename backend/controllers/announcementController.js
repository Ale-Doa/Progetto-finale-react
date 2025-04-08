const Announcement = require('../models/announcementModel');

const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Validazione del contenuto
    if (content.length < 10) {
      return res.status(400).json({ message: 'Il contenuto deve essere di almeno 10 caratteri' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;
    
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Validazione del contenuto
    if (content && content.length < 10) {
      return res.status(400).json({ message: 'Il contenuto deve essere di almeno 10 caratteri' });
    }
    
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;
    
    const updatedAnnouncement = await announcement.save();
    
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    await Announcement.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};