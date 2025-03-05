//Imports
const express = require("express");
const News = require("../models/news");

//Express Router
const newsRouter = express.Router();


//Endpoints for /news
newsRouter.route("/")
//REST API OPERATIONS
//GET
.get((req, res, next) => {
    News.find()
    .then(news => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(news)
    })
    .catch(err => next(err));
})
//POST
.post((req, res, next) => {
    News.create(req.body)
    .then(update => {
        console.log(`Updated: `, update);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(update);
    })
    .catch(err => next(err));
})
//PUT
.put((req, res) => {
    res.statusCode = 403;//not supported
    res.end("PUT operation is not supported on /news");
})
//DELETE
.delete((req, res, next) => {
    News.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
})

//Endpoints for /:id
newsRouter.route("/:newsId")
//GET
.get((req, res, next) => {
    News.findById(req.params.newsId)
    .then(news=> {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(news);
    })
    .catch(err => next(err));
})
//POST
.post((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`POST operation is not allowed on /news/${req.params.newsId}`);
})
//PUT
.put((req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, {
        $set: req.body
    }, {
        new: true
    })
    .then(news => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(news);
    })
    .catch(err => next(err));
})
//DELETE
.delete((req, res, next) => {
    News.findByIdAndDelete(req.params.newsId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
})

//Endpoints for /:id/comment
newsRouter.route("/:newsId/comments")
//GET
.get((req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        if(news) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(news.comments);
        } else {
            err = new Error(`Comment ${req.params.newsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
//POST
.post((req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        if (!news) {
            const err = new Error(`News article ${req.params.newsId} not found`);
            err.status = 404;
            return next(err);
        }

        console.log("Incoming request body:", req.body); // Debugging line

        // Ensure req.body contains valid fields
        if (!req.body.text || !req.body.author) {
            const err = new Error("Comment must have 'text' and 'author' fields");
            err.status = 400;
            return next(err);
        }

        news.comments.push(req.body); // Push new comment
        return news.save();
    })
    .then(news => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(news.comments);
    })
    .catch(err => next(err));
})
//PUT
.put( (req, res) => {
    res.statusCode = 403;//not supported
    res.end(`PUT operation is not supported on /news/${req.params.newsId}/comments`);
})
//DELETE
.delete((req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        if(news) {
            for(let i = (news.comments.length-1); i >= 0; i--) {
                news.comments.id(news.comments[i]._id).deleteOne();
            }
            news.save()
            .then(news => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(news.comments);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Comment ${req.params.newsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

//Endpoints for /:id/comment/like
newsRouter.route("/:newsId/like")
//POST
.get((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`GET operation is not allowed on /news/${req.params.newsId}/like`);
})
//POST
.post((req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, {
        $inc: {
            likes: 1
        }
    }, {
        new: true
    })
    .then(news => {
        if (!news) {
            const err = new Error(`News article ${req.params.newsId} not found`);
            err.status = 404;
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Liked successfully", likes: news.likes });
    })
    .catch(err => next(err));
})
//PUT
.put((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`PUT operation is not allowed on /news/${req.params.newsId}/like`);
})
//DELETE
.delete((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`DELETE operation is not allowed on /news/${req.params.newsId}/like`);
})

//Endpoints for /:id/comment/share
newsRouter.route("/:newsId/share")
//POST
.get((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`GET operation is not allowed on /news/${req.params.newsId}/share`);
})
//POST
.post((req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, {
        $inc: {
            shares: 1
        }
    }, {
        new: true
    })
    .then(news => {
        if (!news) {
            const err = new Error(`News article ${req.params.newsId} not found`);
            err.status = 404;
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Shared successfully", shares: news.shares });
    })
    .catch(err => next(err));
})
//PUT
.put((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`PUT operation is not allowed on /news/${req.params.newsId}/share`);
})
//DELETE
.delete((req, res) => {
    res.statusCode = 403;//forbidden 
    res.end(`DELETE operation is not allowed on /news/${req.params.newsId}/share`);
})

//Exports
module.exports = newsRouter;