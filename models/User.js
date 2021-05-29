/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

/** Page Specific Functions */
// Allow empty string for name.firstName
function firstNameRequired() {
  let name = this.name.firstName
  return typeof name === 'string' ? false : true
}
// Allow empty string for name.nickName
function lastNameRequired() {
  let name = this.name.lastName
  return typeof name === 'string' ? false : true
}
// Allow empty string for name.nickName
function nickNameRequired() {
  let name = this.name.nickName
  return typeof name === 'string' ? false : true
}
// Allow empty string for emails.main
function mainEmailRequired() {
  let email = this.credentials.emails.main
  return typeof email === 'string' ? false : true
}
// Allow empty string for emails.backup
function backupEmailRequired() {
  let email = this.credentials.emails.backup
  return typeof email === 'string' ? false : true
}

/** Data Schema */
const UserSchema = new mongoose.Schema({
    // User's Name
    name: {
        // User's Firstname
        firstName: { type: String, trim: true, required: firstNameRequired },
        // User's Lastname
        lastName: { type: String, trim: true, required: lastNameRequired },
        // User's Nickname
        nickName: { type: String, trim: true, required: nickNameRequired }
    },
    credentials: {
        // User's Emails
        emails: {
          // Main Email
          main: { type: String, trim: true, required: mainEmailRequired },
          // Backup Email
          backup: { type: String, trim: true, required: backupEmailRequired }
        },
        // User's Password
        password: { type: String, trim: true, required:true, min: 6 },
    },
    // User's Home
    homes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
    // User's About
    abouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "About" }],
    // User's Social Media
    socialMedias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Socialmedia" }],
    // User's Edu
    educations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    // User's Job
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    // User's Resume
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
    // User's Skills
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    // User's Projects
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    // User's Blog Posts
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    // User's Status (1 = Active, 0 = Deactive)
    status: { type: Number, required: true, default: 0 }
}, { timestamps: true })

/** Exports */
module.exports = mongoose.model('User', UserSchema)