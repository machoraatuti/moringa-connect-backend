const Discussion = require('../models/Discussion');

// Get all discussions
exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate('author', 'name email profilePicture')
      .populate('replies.author', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions', error: error.message });
  }
};

// Get a single discussion by ID
exports.getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('replies.author', 'name email profilePicture');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussion', error: error.message });
  }
};

// Create a new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const newDiscussion = new Discussion({
      title,
      description,
      author: req.user.id, // Assuming req.user is set by auth middleware
    });
    
    const savedDiscussion = await newDiscussion.save();
    await savedDiscussion.populate('author', 'name email profilePicture');
    
    res.status(201).json(savedDiscussion);
  } catch (error) {
    res.status(400).json({ message: 'Error creating discussion', error: error.message });
  }
};

// Update a discussion
exports.updateDiscussion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author of the discussion
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this discussion' });
    }
    
    discussion.title = title || discussion.title;
    discussion.description = description || discussion.description;
    
    const updatedDiscussion = await discussion.save();
    await updatedDiscussion.populate('author', 'name email profilePicture');
    await updatedDiscussion.populate('replies.author', 'name email profilePicture');
    
    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(400).json({ message: 'Error updating discussion', error: error.message });
  }
};

// Delete a discussion
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author or an admin
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }
    
    await discussion.deleteOne();
    
    res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting discussion', error: error.message });
  }
};

// Add a reply to a discussion
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    discussion.replies.push({
      author: req.user.id,
      content
    });
    
    const updatedDiscussion = await discussion.save();
    await updatedDiscussion.populate('author', 'name email profilePicture');
    await updatedDiscussion.populate('replies.author', 'name email profilePicture');
    
    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(400).json({ message: 'Error adding reply', error: error.message });
  }
};

// Upvote a discussion
exports.upvoteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    discussion.upvotes += 1;
    const updatedDiscussion = await discussion.save();
    
    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(400).json({ message: 'Error upvoting discussion', error: error.message });
  }
};

// Downvote a discussion
exports.downvoteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    discussion.downvotes += 1;
    const updatedDiscussion = await discussion.save();
    
    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(400).json({ message: 'Error downvoting discussion', error: error.message });
  }
};