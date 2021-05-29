/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
const ContactSchema = new mongoose.Schema({
  // Sender Gmail
  senderGmail: { type: String, trim: true, required: true },
  // Sender Email
  senderEmail: { type: String, trim: true, required: true },
  // Client Id
  clientId: { type: String, trim: true, required: true },
  // Client Secret
  clientSecret: { type: String, trim: true, required: true },
  // Refresh Token
  refreshToken: { type: String, trim: true, required: true },
  // Status (1 = Ready, 0 = Yet)
  status: { type: Number, required: true, default: 0 },
  // Mail
  mails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mail" }],
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Contact', ContactSchema)