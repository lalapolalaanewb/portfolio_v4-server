/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for description
function descriptionRequired() {
  let desc = this.description
  return typeof desc === 'string' ? false : true
}

/** Data Schema */
const HomeSchema = new mongoose.Schema({
  // Topline
  topline: { type: String, trim: true, required: true },
  // Headline
  headline: { type: String, trim: true, required: true },
  // Desc
  description: { type: String, trim: true, required: descriptionRequired },
  // Btn Purpose
  btnPurpose: { type: String, trim: true, required: true },
  // Btn Label
  btnLabel: { type: String, trim: true, required: true },
  // Btn Link
  btnLink: { type: String, trim: true, required: true },
  // Img Position
  imgPosition: { type: String, trim: true, required: true },
  // Img Src
  imgSrc: { type: String, trim: true, required: true },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Home', HomeSchema)