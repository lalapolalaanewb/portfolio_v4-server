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
  getPrivateUserJob, 
  addPrivateUserJob, 
  updatePrivateUserJob, updatePrivateUserJobPublish,
  deletePrivateUserJob, 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User's Job)
// @route   POST /api/v1/users/private/profile/job/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserJob)
  // .get(getPrivateUserJob)

// @desc    Portfolio V4 Users Profile (Add A User's Job)
// @route   POST /api/v1/users/private/profile/job/add
// @access  Private (Require sessionId & uid)
router.route('/add')
  .post(redirect2Login, addPrivateUserJob)
  // .post(addPrivateUserJob)

// @desc    Portfolio V4 Users Profile (Update A User's Job)
// @route   POST /api/v1/users/private/profile/job/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserJob)
  // .post(updatePrivateUserJob)

// @desc    Portfolio V4 Users Profile (Update A User's Job Publish)
// @route   POST /api/v1/users/private/profile/job/update/publish
// @access  Private (Require sessionId & uid)
router.route('/update/publish')
  .post(redirect2Login, updatePrivateUserJobPublish)
  // .post(updatePrivateUserJobPublish)

// @desc    Portfolio V4 Users Profile (Delete A User's Job)
// @route   POST /api/v1/users/private/profile/job/delete
// @access  Private (Require sessionId & uid)
router.route('/delete')
  .post(redirect2Login, deletePrivateUserJob)
  // .post(deletePrivateUserJob)

/** Export */
module.exports = router