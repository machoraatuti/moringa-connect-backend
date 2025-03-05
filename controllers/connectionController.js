const User = require('../models/User');

// Get all user connections
exports.getUserConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connections', 'name email profilePicture bio graduationYear course');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.connections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connections', error: error.message });
  }
};

// Get connection requests
exports.getConnectionRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connectionRequests', 'name email profilePicture bio graduationYear course');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.connectionRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connection requests', error: error.message });
  }
};

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
    }
    
    const requestedUser = await User.findById(req.params.id);
    
    if (!requestedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if connection request already exists
    if (requestedUser.connectionRequests.includes(req.user.id)) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }
    
    // Check if they are already connected
    if (requestedUser.connections.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already connected with this user' });
    }
    
    // Add to connection requests
    requestedUser.connectionRequests.push(req.user.id);
    await requestedUser.save();
    
    res.status(200).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending connection request', error: error.message });
  }
};

// Accept connection request
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requestingUser = await User.findById(req.params.id);
    
    if (!requestingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if connection request exists
    if (!currentUser.connectionRequests.includes(req.params.id)) {
      return res.status(400).json({ message: 'No connection request from this user' });
    }
    
    // Remove from connection requests
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      id => id.toString() !== req.params.id
    );
    
    // Add to connections (for both users)
    currentUser.connections.push(req.params.id);
    requestingUser.connections.push(req.user.id);
    
    await currentUser.save();
    await requestingUser.save();
    
    res.status(200).json({ message: 'Connection request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting connection request', error: error.message });
  }
};

// Reject connection request
exports.rejectConnectionRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Check if connection request exists
    if (!currentUser.connectionRequests.includes(req.params.id)) {
      return res.status(400).json({ message: 'No connection request from this user' });
    }
    
    // Remove from connection requests
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      id => id.toString() !== req.params.id
    );
    
    await currentUser.save();
    
    res.status(200).json({ message: 'Connection request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting connection request', error: error.message });
  }
};

// Remove connection
exports.removeConnection = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const connectionUser = await User.findById(req.params.id);
    
    if (!connectionUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if they are connected
    if (!currentUser.connections.includes(req.params.id)) {
      return res.status(400).json({ message: 'Not connected with this user' });
    }
    
    // Remove from connections (for both users)
    currentUser.connections = currentUser.connections.filter(
      id => id.toString() !== req.params.id
    );
    connectionUser.connections = connectionUser.connections.filter(
      id => id.toString() !== req.user.id
    );
    
    await currentUser.save();
    await connectionUser.save();
    
    res.status(200).json({ message: 'Connection removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing connection', error: error.message });
  }
};