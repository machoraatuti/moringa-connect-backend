const express = require("express");
const router = express.Router();
const Event = require("../models/events");
const auth = require("../authenticate");
const cors = require("../routes/cors");

// CORS preflight
router.options("*", cors.corsWithOptions, (req, res) => res.sendStatus(200));

// Create an event (requires auth)
router.post("/", cors.corsWithOptions, auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events (requires auth)
router.get("/", cors.cors, auth, async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event (requires auth)
router.get("/:id", cors.cors, auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event (requires auth)
router.put("/:id", cors.corsWithOptions, auth, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an event (requires auth)
router.delete("/:id", cors.corsWithOptions, auth, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/unlike an event (requires auth)
router.post("/:id/like", cors.corsWithOptions, auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const likeIndex = event.likes.indexOf(userId);

    if (likeIndex !== -1) {
      event.likes.splice(likeIndex, 1); // Unlike
    } else {
      event.likes.push(userId); // Like
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment on an event (requires auth)
router.post("/:id/comment", cors.corsWithOptions, auth, async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ error: "User ID and text are required." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const comment = {
      author: userId,
      text,
      createdAt: new Date(),
    };

    event.comments.push(comment);
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
