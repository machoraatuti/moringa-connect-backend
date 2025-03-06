const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  bio: { type: String },
  graduationYear: { type: Number },
  course: { type: String },
  connections: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  connectionRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);

