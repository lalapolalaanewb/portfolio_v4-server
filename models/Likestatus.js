/** Dependencies */
// Mongoose
const mongoose = require('mongoose')

// Page Specific Functions
// Allow empty string for ipv4
function ipv4Required() {
  let ip = this.ipv4
  return typeof ip === 'string' ? false : true
}

/** Data Schema */
const LikestatusSchema = new mongoose.Schema({
  // Liked by User? 
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // IP Address
  ipv4: { type: String, trim: true, required: ipv4Required },
  // Liked projects
  likedProjects: [{
    // Project ID
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    // Like Status
    status: { type: Boolean, required: true, default: false }
  }],
  // Liked posts
  likedPosts: [{
    // Post ID
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    // Like Status
    status: { type: Boolean, required: true, default: false }
  }],
  // // Liked comments
  // likedComments: [{
  //   // Comment ID
  //   commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  //   // Like Status
  //   status: { type: Boolean, required: true, default: false }
  // }]
}, { timestamps: true })

/** Exports */
module.exports = mongoose.model('Likestatus', LikestatusSchema)