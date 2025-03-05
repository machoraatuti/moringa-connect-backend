const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const auth = require('../middleware/auth');

// Get feed for logged in user
router.get('/', auth, feedController.getFeed);

// Create a new post
router.post('/', auth, feedController.createPost);

// Get a specific post
router.get('/post/:id', feedController.getPostById);

// Update a post
router.put('/post/:id', auth, feedController.updatePost);

// Delete a post
router.delete('/post/:id', auth, feedController.deletePost);

// Like a post
router.put('/post/:id/like', auth, feedController.likePost);

// Unlike a post
router.put('/post/:id/unlike', auth, feedController.unlikePost);

// Add comment to a post
router.post('/post/:id/comment', auth, feedController.addComment);

// Delete comment from a post
router.delete('/post/:id/comment/:commentId', auth, feedController.deleteComment);

module.exports = router;