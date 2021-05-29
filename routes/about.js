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
  getPrivateUserAbout, 
  addPrivateUserAbout,
  updatePrivateUserAbout, updatePrivateUserAboutImg, updatePrivateUserAboutPublish,
  deletePrivateUserAbout, 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User's About)
// @route   POST /api/v1/users/private/profile/about/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserAbout)
  // .get(getPrivateUserAbout)

// @desc    Portfolio V4 Users Profile (Add A User's About)
// @route   POST /api/v1/users/private/profile/about/add
// @access  Private (Require sessionId & uid)
router.route('/add')
  .post(redirect2Login, uploadImgFile.single('file'), addPrivateUserAbout)
  // .post(uploadImgFile.single('file'), addPrivateUserAbout)

// @desc    Portfolio V4 Users Profile (Update A User's About)
// @route   POST /api/v1/users/private/profile/about/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserAbout)
  // .post(updatePrivateUserAbout)

// @desc    Portfolio V4 Users Profile (Update A User's About Img)
// @route   POST /api/v1/users/private/profile/about/update/image
// @access  Private (Require sessionId & uid)
router.route('/update/image')
  .post(redirect2Login, uploadImgFile.single('file'), updatePrivateUserAboutImg)
  // .post(uploadImgFile.single('file'), updatePrivateUserAboutImg)

// @desc    Portfolio V4 Users Profile (Update A User's About Publish)
// @route   POST /api/v1/users/private/profile/about/update/publish
// @access  Private (Require sessionId & uid)
router.route('/update/publish')
  .post(redirect2Login, updatePrivateUserAboutPublish)
  // .post(updatePrivateUserAboutPublish)

// @desc    Portfolio V4 Users Profile (Delete A User's About)
// @route   POST /api/v1/users/private/profile/about/delete
// @access  Private (Require sessionId & uid)
router.route('/delete')
  .post(redirect2Login, deletePrivateUserAbout)
  // .post(deletePrivateUserAbout)

/** Export */
module.exports = router