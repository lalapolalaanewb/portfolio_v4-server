/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for course
function courseRequired() {
  let state = this.course
  return typeof state === 'string' ? false : true
}
// Allow empty string for title
function titleRequired() {
  let state = this.title
  return typeof state === 'string' ? false : true
}
// Allow empty string for entity
function entityRequired() {
  let state = this.entity
  return typeof state === 'string' ? false : true
}

/** Data Schema */
const EducationSchema = new mongoose.Schema({
  // Course
  course: { type: String, trim: true, required: courseRequired },
  // Title
  title: { type: String, trim: true, required: titleRequired },
  // Entity
  entity: { type: String, trim: true, required: entityRequired },
  // Study Status
  studyStatus: { type: String, trim: true, required: true },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Education', EducationSchema)