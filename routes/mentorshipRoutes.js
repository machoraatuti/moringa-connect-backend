const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const auth = require('../authenticate');
const cors = require("../routes/cors"); 

// Handle preflight requests for all routes in this router
router.options('*', cors.corsWithOptions);

// Get all mentorship requests (requires auth)
router.get('/', cors.cors, auth.verifyUser, mentorshipController.getAllMentorships);

// Get mentorship by ID (requires auth)
router.get('/:id', cors.cors, auth.verifyUser, mentorshipController.getMentorshipById);

// Create mentorship request (requires auth)
router.post('/', cors.corsWithOptions, auth.verifyUser, mentorshipController.createMentorship);

// Update mentorship status (requires auth)
router.put('/:id', cors.corsWithOptions, auth.verifyUser, mentorshipController.updateMentorshipStatus);

// Toggle mentor availability (requires auth)
router.put('/availability/toggle', cors.corsWithOptions, auth.verifyUser, mentorshipController.toggleAvailability);

module.exports = router;
