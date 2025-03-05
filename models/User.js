// Add to your existing User model
const userSchema = new Schema({
    // Other fields...
    connections: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    connectionRequests: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  });