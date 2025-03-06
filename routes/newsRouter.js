const express = require("express");
const News = require("../models/news");
const auth = require("../authenticate");
const cors = require("../routes/cors");

const newsRouter = express.Router();

newsRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.find()
    .then(news => res.json(news))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.create(req.body)
    .then(update => res.json(update))
    .catch(err => next(err));
})
.put(cors.corsWithOptions, auth.verifyUser, (req, res) => res.status(403).end("PUT not supported"))
.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.deleteMany()
    .then(response => res.json(response))
    .catch(err => next(err));
});

newsRouter.route("/:newsId")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => res.json(news))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, (req, res) => res.status(403).end(`POST not allowed`))
.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, { $set: req.body }, { new: true })
    .then(news => res.json(news))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findByIdAndDelete(req.params.newsId)
    .then(response => res.json(response))
    .catch(err => next(err));
});

newsRouter.route("/:newsId/comments")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => res.json(news.comments))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        news.comments.push(req.body);
        return news.save();
    })
    .then(news => res.json(news.comments))
    .catch(err => next(err));
})
.put(cors.corsWithOptions, auth.verifyUser, (req, res) => res.status(403).end(`PUT not supported`))
.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        news.comments = [];
        return news.save();
    })
    .then(news => res.json(news.comments))
    .catch(err => next(err));
});

module.exports = newsRouter;
