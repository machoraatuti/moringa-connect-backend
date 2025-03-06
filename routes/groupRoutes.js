const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require("../authenticate");
const cors = require("../routes/cors");

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, groupController.getAllGroups)
.post(cors.corsWithOptions, authenticate.verifyUser, groupController.createGroup);

router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, groupController.getGroupById)
.put(cors.corsWithOptions, authenticate.verifyUser, groupController.updateGroup)
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, groupController.deleteGroup);

router.route('/:id/join')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, groupController.joinGroup);

router.route('/:id/leave')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, groupController.leaveGroup);

module.exports = router;
