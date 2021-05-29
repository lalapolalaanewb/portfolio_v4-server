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
  getPrivateUserEducation, 
  addPrivateUserEducation, 
  updatePrivateUserEducation, updatePrivateUserEducationPublish,
  deletePrivateUserEducation, 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User's Education)
// @route   POST /api/v1/users/private/profile/education/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserEducation)
  // .get(getPrivateUserEducation)

// @desc    Portfolio V4 Users Profile (Add A User's Education)
// @route   POST /api/v1/users/private/profile/education/add
// @access  Private (Require sessionId & uid)
router.route('/add')
  .post(redirect2Login, addPrivateUserEducation)
  // .post(addPrivateUserEducation)

// @desc    Portfolio V4 Users Profile (Update A User's Education)
// @route   POST /api/v1/users/private/profile/education/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserEducation)
  // .post(updatePrivateUserEducation)

// @desc    Portfolio V4 Users Profile (Update A User's Education Publish)
// @route   POST /api/v1/users/private/profile/education/update/publish
// @access  Private (Require sessionId & uid)
router.route('/update/publish')
  .post(redirect2Login, updatePrivateUserEducationPublish)
  // .post(updatePrivateUserEducationPublish)

// @desc    Portfolio V4 Users Profile (Delete A User's Education)
// @route   POST /api/v1/users/private/profile/education/delete
// @access  Private (Require sessionId & uid)
router.route('/delete')
  .post(redirect2Login, deletePrivateUserEducation)
  // .post(deletePrivateUserEducation)

/** Export */
module.exports = router