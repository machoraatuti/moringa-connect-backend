const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Get all messages for logged in user
router.get('/', auth, messageController.getUserMessages);

// Get conversation with specific user
router.get('/conversation/:userId', auth, messageController.getConversation);

// Send a message
router.post('/', auth, messageController.sendMessage);

// Mark message as read
router.put('/:id/read', auth, messageController.markAsRead);

// Delete a message
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;