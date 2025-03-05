//Imports
const express = require("express");
const auth = require('../middleware/auth'); // You'll need to create this middleware
const newsController = require('../controllers/newsController');

//Express Router
const newsRouter = express.Router();

// Get all news articles
newsRouter.get('/', newsController.getAllNews);

// Get news article by ID
newsRouter.get('/:newsId', newsController.getNewsById);

// Create new news article (requires auth)
newsRouter.post('/', auth, newsController.createNews);

// Update news article (requires auth)
newsRouter.put('/:newsId', auth, newsController.updateNews);

// Delete news article (requires auth)
newsRouter.delete('/:newsId', auth, newsController.deleteNews);


// Add comment to news article (requires auth)
newsRouter.post('/:newsId/comments', auth, newsController.addComment);

// Get comments for a news article
newsRouter.get('/:newsId/comments', newsController.getComments);

// Delete all comments in a news article (requires auth)
newsRouter.delete('/:newsId/comments', auth, newsController.deleteComments);


// Like a news article (requires auth)
newsRouter.put('/:newsId/like', auth, newsController.likeNews);


// Share a news article (requires auth)
newsRouter.put('/:newsId/share', auth, newsController.shareNews);


//Exports
module.exports = newsRouter;