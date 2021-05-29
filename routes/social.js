/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
} = require('../controllers')
// Project Methods
const {
  getPrivateUserSocial,
  addPrivateUserSocial,
  updatePrivateUserSocial, updatePrivateUserSocialPublish,
  deletePrivateUserSocial
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User', Social)
// @route   POST /api/v1/users/private/profile/social/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserSocial)
  // .get(getPrivateUserSocial)

// @desc    Portfolio V4 Users Profile (Add A User's Social Media)
// @route   POST /api/v1/users/private/profile/social/add
// @access  Private (Require sessionId & uid)
router.route('/add')
  .post(redirect2Login, addPrivateUserSocial)
  // .post(addPrivateUserSocial)

// @desc    Portfolio V4 Users Profile (Update A User's Social)
// @route   POST /api/v1/users/private/profile/social/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserSocial)
  // .post(updatePrivateUserSocial)
  
// @desc    Portfolio V4 Users Profile (Update A User's Social Publish)
// @route   POST /api/v1/users/private/profile/social/update/publish
// @access  Private (Require sessionId & uid)
router.route('/update/publish')
  .post(redirect2Login, updatePrivateUserSocialPublish)
  // .post(updatePrivateUserSocialPublish)

// @desc    Portfolio V4 Users Profile (Delete A User's Social Media)
// @route   POST /api/v1/users/private/profile/social/delete
// @access  Private (Require sessionId & uid)
router.route('/delete')
  .post(redirect2Login, deletePrivateUserSocial)
  // .post(deletePrivateUserSocial)

/** Export */
module.exports = router