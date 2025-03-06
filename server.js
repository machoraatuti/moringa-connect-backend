require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGO_URI =  'mongodb://127.0.0.1:27018/moringaconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View engine setup (if you need views)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const eventsRouter = require("./routes/eventsRouter");
const newsRouter = require("./routes/newsRouter");
const discussionRoutes = require("./routes/discussionRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const feedRoutes = require("./routes/feedRoutes");
const jobRoutes = require("./routes/jobRoutes");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/news", newsRouter);
app.use("/api/discussions", discussionRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/jobs", jobRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Moringa Connect Backend is Running!");
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Resource not found"));
});

// Error handler (JSON response)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Start Server with fallback ports
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

startServer(PORT);
