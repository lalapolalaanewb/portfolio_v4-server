/** Imports */
// Auth Methods
const { 
  userLogin, userLogout, 
  userRegister, userRegisterOnLike, userRegisterOnComment 
} = require('./auth')
// Contact Methods
const {
  getPrivateContact,
  addPrivateContact,
  updatePrivateContact, updatePrivateContactPublish,
  deletePrivateContact
} = require('./contact')
// Dashboard Methods
const { 
  getPrivateDashboard,
  updatePrivateDashboardRedisAllData 
} = require('./dashboard')
// Mail Methods
const {
  getPublicContactStatus,
  addPublicMail,
  getPrivateMails,
  updatePrivateMailNoty, updatePrivateMailRead, updatePrivateMailReply,
  deletePrivateMail
} = require('./mail')
// Media Methods
const {
  getPrivateMedias,
  addPrivateMedia,
  updatePrivateMedia, updatePrivateMediaPublish,
  deletePrivateMedia
} = require('./media')
// Media Social Methods
const {
  getPrivateMediaSocials, 
  addPrivateMediaSocial, 
  updatePrivateMediaSocial, 
  deletePrivateMediaSocial
} = require('./mediaSocial')
// Policy Methods
const {
  getPublicPolicyComment,
  getPrivatePolicies,
  addPrivatePolicy,
  updatePrivatePolicy, updatePrivatePolicyPublish,
  deletePrivatePolicy
} = require('./policy') 
// Post Methods
const { 
  getPublicPosts, getPublicPost, 
  updatePublicPost, 
  getPrivatePosts, 
  addPrivatePost, 
  updatePrivatePostImg, updatePrivatePostPublish, updatePrivatePost, 
  deletePrivatePost 
} = require('./post')
// Profile About Methods
const {
  getPrivateUserAbout,
  addPrivateUserAbout,
  updatePrivateUserAbout, updatePrivateUserAboutImg, updatePrivateUserAboutPublish,
  deletePrivateUserAbout
} = require('./about')
// Profile Education Methods
const {
  getPrivateUserEducation,
  addPrivateUserEducation,
  updatePrivateUserEducation, updatePrivateUserEducationPublish,
  deletePrivateUserEducation
} = require('./education')
// Profile Home Methods
const {
  getPrivateUserHome,
  addPrivateUserHome,
  updatePrivateUserHome, updatePrivateUserHomeImg, updatePrivateUserHomePublish,
  deletePrivateUserHome
} = require('./home')
// Profile Job Methods
const {
  getPrivateUserJob,
  addPrivateUserJob,
  updatePrivateUserJob, updatePrivateUserJobPublish,
  deletePrivateUserJob
} = require('./job')
// Profile Personal Methods
const { 
  getPrivateUserPersonal, 
  updatePrivateUserPersonal,
  updatePrivateUserPersonalPassword, 
} = require('./personal')
// Profile Resume Methods
const {
  getPrivateUserResume,
  addPrivateUserResume,
  updatePrivateUserResume, updatePrivateUserResumePdf, updatePrivateUserResumePublish,
  deletePrivateUserResume
} = require('./resume')
// Profile Social Methods
const {
  getPrivateUserSocial,
  addPrivateUserSocial,
  updatePrivateUserSocial, updatePrivateUserSocialPublish,
  deletePrivateUserSocial
} = require('./social')
// Project Methods
const { 
  getPublicProjects, 
  updatePublicProject, 
  getPrivateProjects, 
  addPrivateProject, 
  updatePrivateProjectimg, updatePrivateProjectPublish, updatePrivateProject, 
  deletePrivateProject 
} = require('./project')
// Skill Methods
const { 
  getPublicSkills, 
  getPrivateSkills, 
  addPrivateSkill, 
  updatePrivateSkill, 
  deletePrivateSkill 
} = require('./skill')
// Subscription Methods
const {
  addPublicSubscription,
  getPrivateSubscriptions,
  updatePrivateSubscriptionNoty, updatePrivateSubscriptionRead, updatePrivateSubscriptionReply,
  deletePrivateSubscription
} = require('./subscription')
// Technology Methods
const { 
  getPrivateTechs, 
  addPrivateTech, 
  updatePrivateTech, 
  deletePrivateTech 
} = require('./tech')
// User Methods
const {
  getPublicUserFooterPublic, 
  getPublicUserHome,
  getPublicUserAbout,
  getPublicUserResume,
  getPrivateUsers, 
  addPrivateUser, 
  updatePrivateUserActive,
  updatePrivateUser, 
  deletePrivateUser 
} = require('./user')

/** Exports */
module.exports = {
  // Auth
  userLogin, userLogout, 
  userRegister, userRegisterOnLike, userRegisterOnComment,
  // Contact
  getPrivateContact,
  addPrivateContact,
  updatePrivateContact, updatePrivateContactPublish,
  deletePrivateContact,
  // Dashboard
  getPrivateDashboard,
  updatePrivateDashboardRedisAllData,
  // Mail
  getPublicContactStatus,
  addPublicMail,
  getPrivateMails,
  updatePrivateMailNoty, updatePrivateMailRead, updatePrivateMailReply,
  deletePrivateMail,
  // Media
  getPrivateMedias,
  addPrivateMedia,
  updatePrivateMedia, updatePrivateMediaPublish,
  deletePrivateMedia,
  // Media Social
  getPrivateMediaSocials, 
  addPrivateMediaSocial, 
  updatePrivateMediaSocial, 
  deletePrivateMediaSocial,
  // Policy
  getPublicPolicyComment,
  getPrivatePolicies,
  addPrivatePolicy,
  updatePrivatePolicy, updatePrivatePolicyPublish,
  deletePrivatePolicy,
  // Post
  getPublicPosts, getPublicPost, 
  updatePublicPost, 
  getPrivatePosts, 
  addPrivatePost, 
  updatePrivatePostImg, updatePrivatePostPublish, updatePrivatePost, 
  deletePrivatePost,
  // Profile About
  getPrivateUserAbout,
  addPrivateUserAbout,
  updatePrivateUserAbout, updatePrivateUserAboutImg, updatePrivateUserAboutPublish,
  deletePrivateUserAbout,
  // Profile Education
  getPrivateUserEducation,
  addPrivateUserEducation,
  updatePrivateUserEducation, updatePrivateUserEducationPublish,
  deletePrivateUserEducation,
  // Profile Home
  getPrivateUserHome,
  addPrivateUserHome,
  updatePrivateUserHome, updatePrivateUserHomeImg, updatePrivateUserHomePublish,
  deletePrivateUserHome,
  // Profile job
  getPrivateUserJob,
  addPrivateUserJob,
  updatePrivateUserJob, updatePrivateUserJobPublish,
  deletePrivateUserJob,
  // Profile Personal
  getPrivateUserPersonal, 
  updatePrivateUserPersonal,
  updatePrivateUserPersonalPassword, 
  // Profile Resume
  getPrivateUserResume,
  addPrivateUserResume,
  updatePrivateUserResume, updatePrivateUserResumePdf, updatePrivateUserResumePublish,
  deletePrivateUserResume,
  // Profile Social
  getPrivateUserSocial,
  addPrivateUserSocial,
  updatePrivateUserSocial, updatePrivateUserSocialPublish,
  deletePrivateUserSocial,
  // Project
  getPublicProjects, 
  updatePublicProject, 
  getPrivateProjects, 
  addPrivateProject, 
  updatePrivateProjectimg, updatePrivateProjectPublish, updatePrivateProject, 
  deletePrivateProject,
  // Skill
  getPublicSkills, 
  getPrivateSkills, 
  addPrivateSkill, 
  updatePrivateSkill, 
  deletePrivateSkill,
  // Subscription
  addPublicSubscription,
  getPrivateSubscriptions,
  updatePrivateSubscriptionNoty, updatePrivateSubscriptionRead, updatePrivateSubscriptionReply,
  deletePrivateSubscription,
  // Technology
  getPrivateTechs, 
  addPrivateTech, 
  updatePrivateTech, 
  deletePrivateTech,
  // User
  getPublicUserFooterPublic,
  getPublicUserHome,
  getPublicUserAbout,
  getPublicUserResume,
  getPrivateUsers, 
  addPrivateUser, 
  updatePrivateUserActive,
  updatePrivateUser, 
  deletePrivateUser, 
}