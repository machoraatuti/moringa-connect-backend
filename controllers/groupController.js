const Group = require('../models/Group');

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('creator', 'name email profilePicture')
      .populate('members', 'name email profilePicture');
    
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
};

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    const newGroup = new Group({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
      isPublic
    });
    
    const savedGroup = await newGroup.save();
    await savedGroup.populate('creator', 'name email profilePicture');
    
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(400).json({ message: 'Error creating group', error: error.message });
  }
};

// Get a specific group
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name email profilePicture')
      .populate('members', 'name email profilePicture');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error: error.message });
  }
};

// Update a group
exports.updateGroup = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }
    
    group.name = name || group.name;
    group.description = description || group.description;
    if (isPublic !== undefined) group.isPublic = isPublic;
    
    const updatedGroup = await group.save();
    await updatedGroup.populate('creator', 'name email profilePicture');
    await updatedGroup.populate('members', 'name email profilePicture');
    
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: 'Error updating group', error: error.message });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is the creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });
    }
    
    await group.deleteOne();
    
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error: error.message });
  }
};

// Join a group
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }
    
    group.members.push(req.user.id);
    await group.save();
    
    res.status(200).json({ message: 'Successfully joined the group' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining group', error: error.message });
  }
};

// Leave a group
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not a member of this group' });
    }
    
    // Creator cannot leave, they must delete the group
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({ message: 'As the creator, you cannot leave. You can delete the group instead.' });
    }
    
    group.members = group.members.filter(member => member.toString() !== req.user.id);
    await group.save();
    
    res.status(200).json({ message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving group', error: error.message });
  }
};