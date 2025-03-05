const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// Get all groups
router.get('/', groupController.getAllGroups);

// Create a new group
router.post('/', auth, groupController.createGroup);

// Get a specific group
router.get('/:id', groupController.getGroupById);

// Update a group
router.put('/:id', auth, groupController.updateGroup);

// Delete a group
router.delete('/:id', auth, groupController.deleteGroup);

// Join a group
router.post('/:id/join', auth, groupController.joinGroup);

// Leave a group
router.post('/:id/leave', auth, groupController.leaveGroup);

module.exports = router;