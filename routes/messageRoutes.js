const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require("../authenticate");
const cors = require("../routes/cors");

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, messageController.getUserMessages)
.post(cors.corsWithOptions, authenticate.verifyUser, messageController.sendMessage);

router.route('/conversation/:userId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, messageController.getConversation);

router.route('/:id/read')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.put(cors.corsWithOptions, authenticate.verifyUser, messageController.markAsRead);

router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.delete(cors.corsWithOptions, authenticate.verifyUser, messageController.deleteMessage);

module.exports = router;
