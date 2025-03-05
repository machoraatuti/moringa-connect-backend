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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/moringaconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View Engine Setup (for views like error pages)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // ✅ Global CORS
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const eventsRouter = require("./routes/eventsRouter");
const newsRouter = require("./routes/newsRouter");
const discussionRoutes = require("./routes/discussionRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const connectionRoutes = require("./routes/connectionRoutes");

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/events", eventsRouter);
app.use("/news", newsRouter);
app.use("/api/discussions", discussionRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connections', connectionRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Moringa Connect Backend is Running!");
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
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
