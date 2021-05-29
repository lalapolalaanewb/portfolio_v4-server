/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
const MediasocialSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // Short Name
  abbreviation: { type: String, trim: true, required: true },
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Mediasocial', MediasocialSchema)