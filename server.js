require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const discussionRoutes = require('./routes/discussionRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const feedRoutes = require('./routes/feedRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Default Route
app.get("/", (req, res) => {
  res.send("Moringa Connect Backend is Running!");
});

// Routes
app.use('/api/discussions', discussionRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/jobs', jobRoutes);

// Start Server with fallback ports
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port+1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

startServer(PORT);