const News = require('../models/news');

// Get all news articles
exports.getAllNews = (req, res, next) => {
    News.find()
        .then(news => {
            res.status(200).json(news);
        })
        .catch(err => next(err));
};

// Get a single news article by ID
exports.getNewsById = (req, res, next) => {
    News.findById(req.params.newsId)
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json(news);
        })
        .catch(err => next(err));
};

// Create a new news article
exports.createNews = (req, res, next) => {
    News.create(req.body)
        .then(news => {
            res.status(201).json(news);
        })
        .catch(err => next(err));
};

// Update a news article
exports.updateNews = (req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, { $set: req.body }, { new: true })
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json(news);
        })
        .catch(err => next(err));
};

// Delete a news article
exports.deleteNews = (req, res, next) => {
    News.findByIdAndDelete(req.params.newsId)
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json({ message: 'News article deleted successfully' });
        })
        .catch(err => next(err));
};

// Get all comments for a news article
exports.getComments = (req, res, next) => {
    News.findById(req.params.newsId)
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json(news.comments);
        })
        .catch(err => next(err));
};

// Add a comment to a news article
exports.addComment = (req, res, next) => {
    News.findById(req.params.newsId)
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }

            if (!req.body.text || !req.body.author) {
                return res.status(400).json({ message: "Comment must have 'text' and 'author' fields" });
            }

            news.comments.push(req.body);
            return news.save();
        })
        .then(news => {
            res.status(201).json(news.comments);
        })
        .catch(err => next(err));
};

// Delete all comments from a news article
exports.deleteComments = (req, res, next) => {
    News.findById(req.params.newsId)
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }

            news.comments = []; // Clear all comments
            return news.save();
        })
        .then(news => {
            res.status(200).json({ message: 'All comments deleted successfully', comments: news.comments });
        })
        .catch(err => next(err));
};

// Like a news article
exports.likeNews = (req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, { $inc: { likes: 1 } }, { new: true })
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json({ message: "Liked successfully", likes: news.likes });
        })
        .catch(err => next(err));
};

// Share a news article
exports.shareNews = (req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, { $inc: { shares: 1 } }, { new: true })
        .then(news => {
            if (!news) {
                return res.status(404).json({ message: `News article ${req.params.newsId} not found` });
            }
            res.status(200).json({ message: "Shared successfully", shares: news.shares });
        })
        .catch(err => next(err));
};
