/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
  // File Upload
  uploadImgFile,
} = require('../controllers')
// Project Methods
const {
  getPrivateUserHome, 
  addPrivateUserHome,
  updatePrivateUserHome, updatePrivateUserHomeImg, updatePrivateUserHomePublish,
  deletePrivateUserHome, 
} = require('../methods')
// Timeout (handle file upload)
const timeout = require('connect-timeout')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User's About)
// @route   POST /api/v1/users/private/profile/home/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserHome)
  // .get(getPrivateUserHome)

// @desc    Portfolio V4 Users Profile (Add A User's Home)
// @route   POST /api/v1/users/private/profile/home/add
// @access  Private (Require sessionId & uid)
router.route('/add')
  .post(redirect2Login, uploadImgFile.single('file'), addPrivateUserHome)
  // .post(uploadImgFile.single('file'), addPrivateUserHome)

// @desc    Portfolio V4 Users Profile (Update A User's Home)
// @route   POST /api/v1/users/private/profile/home/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserHome)
  // .post(updatePrivateUserHome)

// @desc    Portfolio V4 Users Profile (Update A User's Home Img)
// @route   POST /api/v1/users/private/profile/home/update/image
// @access  Private (Require sessionId & uid)
router.route('/update/image')
  .post(redirect2Login, updatePrivateUserHomeImg)
  // .post(redirect2Login, timeout('30s'), updatePrivateUserHomeImg)
  // .post(redirect2Login, uploadImgFile.single('file'), updatePrivateUserHomeImg)
  // .post(uploadImgFile.single('file'), updatePrivateUserHomeImg)

// @desc    Portfolio V4 Users Profile (Update A User's Home Publish)
// @route   POST /api/v1/users/private/profile/home/update/publish
// @access  Private (Require sessionId & uid)
router.route('/update/publish')
  .post(redirect2Login, updatePrivateUserHomePublish)
  // .post(updatePrivateUserHomePublish)

// @desc    Portfolio V4 Users Profile (Delete A User's Home)
// @route   POST /api/v1/users/private/profile/home/delete
// @access  Private (Require sessionId & uid)
router.route('/delete')
  .post(redirect2Login, deletePrivateUserHome)
  // .post(deletePrivateUserHome)

/** Export */
module.exports = router