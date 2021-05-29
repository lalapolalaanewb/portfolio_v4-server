/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
const CommentSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // User
  user: {
    // Guest Email
    guest: { type: String, trim: true, required: true },
    // Registered Email
    registered: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  // Message
  message: { type: String, required: true },
  // Likes
  like: { type: Number, required: true, default: 0 },
  // Post
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Comment', CommentSchema)