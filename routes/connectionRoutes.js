const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const authenticate = require("../authenticate");
const cors = require("../routes/cors");

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, connectionController.getUserConnections);

router.route('/requests')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, connectionController.getConnectionRequests);

router.route('/request/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, connectionController.sendConnectionRequest);

router.route('/accept/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, connectionController.acceptConnectionRequest);

router.route('/reject/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, connectionController.rejectConnectionRequest);

router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// If only admins can delete connections:
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, connectionController.removeConnection);

module.exports = router;
