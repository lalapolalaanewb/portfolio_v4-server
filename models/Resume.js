/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for contactInfo.website
function websiteRequired() {
  let state = this.contactInfo.website
  return typeof state === 'string' ? false : true
}
// Allow empty string for contactInfo.title
function titleRequired() {
  let state = this.contactInfo.title
  return typeof state === 'string' ? false : true
}
// Allow empty string for description
function descRequired() {
  let state = this.description
  return typeof state === 'string' ? false : true
}

/** Data Schema */
const ResumeSchema = new mongoose.Schema({
  // Pdf Src
  pdfSrc: { type: String, trim: true, required: true },
  // Contact Info
  contactInfo: {
    // Website
    website: { type: String, trim: true, required: websiteRequired },
    // Title
    title: { type: String, trim: true, required: titleRequired },
  },
  // Desc
  description: { type: String, trim: true, required: descRequired },
  // Techs
  techs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Technology" }],
  // Projects
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  // Educations
  educations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
  // Jobs
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Resume', ResumeSchema)