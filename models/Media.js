/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for imgAlt
function imgAltRequired() {
  let state = this.imgAlt
  return typeof state === 'string' ? false : true
}
// Allow empty string for dimension
function dimensionRequired() {
  let state = this.dimension
  return typeof state === 'string' ? false : true
}
// Allow empty string for size
function sizeRequired() {
  let state = this.size
  return typeof state === 'string' ? false : true
}

/** Data Schema */
const MediaSchema = new mongoose.Schema({
  // Img src
  imgSrc: { type: String, trim: true, required: true },
  // Img alt
  imgAlt: { type: String, trim: true, required: imgAltRequired },
  // Dimension
  dimension: { type: String, trim: true, required: dimensionRequired },
  // Size
  size: { type: String, trim: true, required: sizeRequired },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Media', MediaSchema)