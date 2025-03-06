const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const authenticate = require('../authenticate');
const cors = require('../routes/cors');

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, feedController.getFeed)
.post(cors.corsWithOptions, authenticate.verifyUser, feedController.createPost);

router.route('/post/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, feedController.getPostById)
.put(cors.corsWithOptions, authenticate.verifyUser, feedController.updatePost)
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, feedController.deletePost);

router.route('/post/:id/like')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.put(cors.corsWithOptions, authenticate.verifyUser, feedController.likePost);

router.route('/post/:id/unlike')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.put(cors.corsWithOptions, authenticate.verifyUser, feedController.unlikePost);

router.route('/post/:id/comment')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, feedController.addComment);

router.route('/post/:id/comment/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.delete(cors.corsWithOptions, authenticate.verifyUser, feedController.deleteComment);

module.exports = router;
