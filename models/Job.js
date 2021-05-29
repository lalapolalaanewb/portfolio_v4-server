/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for abbreviation
function abbreviationRequired() {
  let state = this.abbreviation
  return typeof state === 'string' ? false : true
}
// Allow empty string for description
function descRequired() {
  let state = this.description
  return typeof state === 'string' ? false : true
}
// Allow empty string for company
function companyRequired() {
  let state = this.company
  return typeof state === 'string' ? false : true
}

/** Data Schema */
// Job Schema
const JobSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // Short Name
  abbreviation: { type: String, trim: true, required: abbreviationRequired },
  // Desc
  description: { type: String, required: descRequired },
  // Company
  company: { type: String, trim: true, required: companyRequired },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Job', JobSchema)