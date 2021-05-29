/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for name
function nameRequired() {
  let state = this.name
  return typeof state === 'string' ? false : true
}
// Allow empty string for privacy
function privacyRequired() {
  let state = this.privacy
  return typeof state === 'string' ? false : true
}
// Allow empty string for comment
function commentRequired() {
  let state = this.comment
  return typeof state === 'string' ? false : true
}

/** Data Schema */
const PolicySchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: nameRequired },
  // Privacy
  privacy: { type: String, trim: true, required: privacyRequired },
  // Comment
  comment: { type: String, trim: true, required: commentRequired },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Policy', PolicySchema)