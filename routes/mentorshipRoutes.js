const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const auth = require('../middleware/auth'); // You'll need to create this middleware

// Get all mentorship requests (requires auth)
router.get('/', auth, mentorshipController.getAllMentorships);

// Get mentorship by ID (requires auth)
router.get('/:id', auth, mentorshipController.getMentorshipById);

// Create mentorship request (requires auth)
router.post('/', auth, mentorshipController.createMentorship);

// Update mentorship status (requires auth)
router.put('/:id', auth, mentorshipController.updateMentorshipStatus);

// Toggle mentor availability (requires auth)
router.put('/availability/toggle', auth, mentorshipController.toggleAvailability);

module.exports = router;