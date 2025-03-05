const Mentorship = require('../models/Mentorship');

// Get all mentorship requests
exports.getAllMentorships = async (req, res) => {
  try {
    // Filter based on user role
    let query = {};
    
    if (req.user.role !== 'admin') {
      // If not admin, only show requests where user is mentor or mentee
      query = {
        $or: [
          { mentor: req.user.id },
          { mentee: req.user.id }
        ]
      };
    }
    
    const mentorships = await Mentorship.find(query)
      .populate('mentor', 'name email profilePicture')
      .populate('mentee', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json(mentorships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentorship requests', error: error.message });
  }
};

// Create a mentorship request
exports.createMentorship = async (req, res) => {
  try {
    const { mentor, topic, message } = req.body;
    
    if (!mentor || !topic) {
      return res.status(400).json({ message: 'Mentor ID and topic are required' });
    }
    
    const newMentorship = new Mentorship({
      mentor,
      mentee: req.user.id, // Current user is the mentee
      topic,
      message,
      status: 'pending'
    });
    
    const savedMentorship = await newMentorship.save();
    await savedMentorship.populate('mentor', 'name email profilePicture');
    await savedMentorship.populate('mentee', 'name email profilePicture');
    
    res.status(201).json(savedMentorship);
  } catch (error) {
    res.status(400).json({ message: 'Error creating mentorship request', error: error.message });
  }
};

// Update mentorship status
exports.updateMentorshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const mentorship = await Mentorship.findById(req.params.id);
    
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }
    
    // Only the mentor can update the status
    if (mentorship.mentor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this mentorship request' });
    }
    
    mentorship.status = status;
    
    const updatedMentorship = await mentorship.save();
    await updatedMentorship.populate('mentor', 'name email profilePicture');
    await updatedMentorship.populate('mentee', 'name email profilePicture');
    
    res.status(200).json(updatedMentorship);
  } catch (error) {
    res.status(400).json({ message: 'Error updating mentorship status', error: error.message });
  }
};

// Get mentorship by ID
exports.getMentorshipById = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate('mentor', 'name email profilePicture')
      .populate('mentee', 'name email profilePicture');
    
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }
    
    // Check if user is involved in the mentorship
    if (
      mentorship.mentor.toString() !== req.user.id && 
      mentorship.mentee.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this mentorship request' });
    }
    
    res.status(200).json(mentorship);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentorship request', error: error.message });
  }
};

// Toggle mentor availability
exports.toggleAvailability = async (req, res) => {
  try {
    // Find all mentorships where the user is a mentor
    const mentorships = await Mentorship.find({ mentor: req.user.id });
    
    // Update availability for all of them
    const updates = mentorships.map(mentorship => {
      mentorship.availability = !mentorship.availability;
      return mentorship.save();
    });
    
    await Promise.all(updates);
    
    res.status(200).json({ 
      message: `You are now ${!mentorships[0]?.availability ? 'available' : 'unavailable'} for mentorship` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
};