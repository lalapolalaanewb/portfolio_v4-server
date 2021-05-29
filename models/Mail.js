/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
const MailSchema = new mongoose.Schema({
  // Name
  fromWho: { type: String, trim: true, required: true },
  // Email
  fromTo: { type: String, trim: true, required: true },
  // Concerns
  fromConcerns: { type: String, trim: true, required: true },
  // Subject
  fromSubject: { type: String, trim: true, required: true },  
  // Message
  fromMessage: { type: String, trim: true, required: true },
  // Status Noty (1 = Send, 0 = Yet)
  statusNoty: { type: Number, required: true, default: 0 },
  // Status Read (1 = Read, 0 = Yet)
  statusRead: { type: Number, required: true, default: 0 },
  // Status Reply (1 = Replied, 0 = Yet)
  statusReply: { type: Number, required: true, default: 0 },
  // Reply Date
  replyDate: { type: Date, required: false }
}, { timestamps: true })

/** Export */
module.exports = mongoose.model('Mail', MailSchema)