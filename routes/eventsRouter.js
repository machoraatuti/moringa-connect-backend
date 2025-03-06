const express = require("express");
const cors = require("./cors");
const authenticate = require("../authenticate");
const Event = require("../models/events");

const router = express.Router();

router
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
      const events = await Event.find().populate("author");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(events);
    } catch (err) {
      next(err);
    }
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      try {
        const event = new Event({
          ...req.body,
          author: req.user._id,
        });
        await event.save();
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(event);
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route("/:id")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id).populate("author");
      if (!event) {
        res.statusCode = 404;
        return res.json({ message: "Event not found" });
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(event);
    } catch (err) {
      next(err);
    }
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      try {
        const event = await Event.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        if (!event) {
          res.statusCode = 404;
          return res.json({ message: "Event not found" });
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(event);
      } catch (err) {
        next(err);
      }
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
          res.statusCode = 404;
          return res.json({ message: "Event not found" });
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Event deleted successfully" });
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route("/:id/like")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        const event = await Event.findById(req.params.id);
        if (!event) {
          res.statusCode = 404;
          return res.json({ message: "Event not found" });
        }
        event.likes.push(req.user._id);
        await event.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Event liked successfully" });
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route("/:id/comment")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        const event = await Event.findById(req.params.id);
        if (!event) {
          res.statusCode = 404;
          return res.json({ message: "Event not found" });
        }
        event.comments.push({
          text: req.body.text,
          author: req.user._id,
        });
        await event.save();
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Comment added successfully" });
      } catch (err) {
        next(err);
      }
    }
  );

module.exports = router;
