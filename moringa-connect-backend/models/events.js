const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Comment Schema
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Event Schema
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    image: {
      type: String // URL of the event image
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Users who liked the event
        ref: 'User'
      }
    ],
    comments: [commentSchema], // Array of comment objects
    
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
