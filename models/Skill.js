/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Data Schema */
// Skill Schema
const SkillSchema = new mongoose.Schema({
  // Name
  name: { type: String, trim: true, required: true },
  // techs
  techs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Technology" }],
  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

/** Export */
const Skill = mongoose.model('Skill', SkillSchema)
module.exports = {
  Skill
}