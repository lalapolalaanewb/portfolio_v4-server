/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for excerpt
function excerptRequired() {
  let excerpt = this.excerpt
  return typeof excerpt === 'string' ? false : true
}
// Allow empty string for description
function descriptionRequired() {
  let description = this.description
  return typeof description === 'string' ? false : true
}

/** Data Schema */
const PostSchema = new mongoose.Schema({
  // Title
  title: { type: String, trim: true, required: true },
  // Image SRC
  imgSrc: { type: String, trim: true, required: true },
  // Excerpt
  excerpt: { type: String, required: excerptRequired },
  // Description
  description: { type: String, required: descriptionRequired },
  // Technologies
  tech: { type: mongoose.Schema.Types.ObjectId, ref: "Technology" },
  // Status (0: Unpublished, 1: Published)
  status: { type: Number, required: true, default: 0 },
  // PublishedAt
  publishedAt: { type: Date, required: false },
  // Likes
  like: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Comments
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Post', PostSchema)