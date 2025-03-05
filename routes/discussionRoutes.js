const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const auth = require('../middleware/auth'); // You'll need to create this middleware

// Get all discussions
router.get('/', discussionController.getAllDiscussions);

// Get discussion by ID
router.get('/:id', discussionController.getDiscussionById);

// Create new discussion (requires auth)
router.post('/', auth, discussionController.createDiscussion);

// Update discussion (requires auth)
router.put('/:id', auth, discussionController.updateDiscussion);

// Delete discussion (requires auth)
router.delete('/:id', auth, discussionController.deleteDiscussion);

// Add reply to discussion (requires auth)
router.post('/:id/reply', auth, discussionController.addReply);

// Upvote discussion (requires auth)
router.put('/:id/upvote', auth, discussionController.upvoteDiscussion);

// Downvote discussion (requires auth)
router.put('/:id/downvote', auth, discussionController.downvoteDiscussion);

module.exports = router;