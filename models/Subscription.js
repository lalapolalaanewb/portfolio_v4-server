/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
const SubcriptionSchema = new mongoose.Schema({
  // Email
  fromWho: { type: String, trim: true, required: true },
  // Status Noty (1 = Send, 0 = Yet)
  statusNoty: { type: Number, required: true, default: 0 },
  // Status Read (1 = Read, 0 = Yet)
  statusRead: { type: Number, required: true, default: 0 },
  // Status Reply (1 = Replied, 0 = Yet)
  statusReply: { type: Number, required: true, default: 0 },
  // Subscribe To
  subsTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Subcription', SubcriptionSchema)