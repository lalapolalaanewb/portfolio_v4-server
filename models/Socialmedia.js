/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
// Social Media Schema
const SocialmediaSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // icon
  icon: { type: mongoose.Schema.Types.ObjectId, ref: "Mediasocial" },
  // url
  url: { type: String, required: true },
  // Status (1 = Published, 0 = Unpublished)
  status: { type: Number, required: true, default: 0 },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Socialmedia', SocialmediaSchema)