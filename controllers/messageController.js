const Message = require('../models/Message');

// Get all messages for a user
exports.getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort('-createdAt');
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort('createdAt');
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content
    });
    
    const savedMessage = await newMessage.save();
    await savedMessage.populate('sender', 'name email profilePicture');
    await savedMessage.populate('recipient', 'name email profilePicture');
    
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    
    message.read = true;
    await message.save();
    
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the sender or recipient
    if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.deleteOne();
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};