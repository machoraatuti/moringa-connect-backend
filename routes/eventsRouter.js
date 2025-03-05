const express = require("express");
const router = express.Router();
const Event = require("../models/events");

//  POST /events → Create an event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find(); // 
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  PUT /events/:id → Update an event
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /events/:id → Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /events/:id/like → Like an event
router.post("/:id/like", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Check if user has already liked the event
    const likeIndex = event.likes.indexOf(userId);

    if (likeIndex !== -1) {
      // If user already liked, remove the like (Unlike)
      event.likes.splice(likeIndex, 1);
    } else {
      // If user hasn't liked, add the like
      event.likes.push(userId);
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /events/:id/comment → Comment on an event
router.post("/:id/comment", async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ error: "User ID and text are required." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const comment = {
      author: userId, // Fix: Use 'author' instead of 'user'
      text: text,
      createdAt: new Date(), // Ensure timestamp is included
    };

    event.comments.push(comment);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
