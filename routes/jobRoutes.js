// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Get all job listings
router.get('/', jobController.getAllJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// Create new job posting (protected)
router.post('/create', auth, jobController.createJob);

// Update job posting (protected)
router.put('/update/:id', auth, jobController.updateJob);

// Delete job posting (protected)
router.delete('/delete/:id', auth, jobController.deleteJob);

module.exports = router;