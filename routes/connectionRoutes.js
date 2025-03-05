const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const auth = require('../middleware/auth');

// Get all connections for logged in user
router.get('/', auth, connectionController.getUserConnections);

// Get all connection requests for logged in user
router.get('/requests', auth, connectionController.getConnectionRequests);

// Send a connection request
router.post('/request/:id', auth, connectionController.sendConnectionRequest);

// Accept a connection request
router.post('/accept/:id', auth, connectionController.acceptConnectionRequest);

// Reject a connection request
router.post('/reject/:id', auth, connectionController.rejectConnectionRequest);

// Remove an existing connection
router.delete('/:id', auth, connectionController.removeConnection);

module.exports = router;