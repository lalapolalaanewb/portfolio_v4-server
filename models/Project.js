/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for description
function descriptionRequired() {
  let description = this.description
  return typeof description === 'string' ? false : true
}

// Allow empty string for subDescription
function subDescriptionRequired() {
  let subDescription = this.subDescription
  return typeof subDescription === 'string' ? false : true
}

// Allow empty string for liveUrls.www
function liveUrlWwwRequired() {
  let liveUrl = this.liveUrls.www
  return typeof liveUrl === 'string' ? false : true
}

// Allow empty string for liveUrls.code
function liveUrlCodeRequired() {
  let liveUrl = this.liveUrls.code
  return typeof liveUrl === 'string' ? false : true
}

/** Data Schema */
const ProjectSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // Image SRC
  imgSrc: { type: String, trim: true, required: true },
  // Description
  description: { type: String, required: descriptionRequired },
  // SubDescription
  subDescription: { type: String, required: subDescriptionRequired },
  // Live URLs
  liveUrls: {
    // www
    www: { type: String, trim: true, required: liveUrlWwwRequired },
    // code
    code: { type: String, trim: true, required: liveUrlCodeRequired }
  },
  // Technologies
  techs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Technology" }],
  // Status (0: Unpublished, 1: Published)
  status: { type: Number, required: true, default: 0 },
  // PublishedAt
  publishedAt: { type: Date, required: true },
  // Likes
  like: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Project', ProjectSchema)