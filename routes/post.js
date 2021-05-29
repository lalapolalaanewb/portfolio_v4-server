/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, adminAccessPublic,
  // File Upload
  uploadImgFile,
} = require('../controllers')
// Project Methods
const { getPublicPosts, getPublicPost, updatePublicPost, getPrivatePosts, addPrivatePost, updatePrivatePostImg, updatePrivatePostPublish, updatePrivatePost, deletePrivatePost } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/posts
// @access  Public (Only need Admin Public Access Key)
router.route('/')
  .post(adminAccessPublic, getPublicPosts)

// @desc    Portfolio V4 Posts (Get A Post)
// @route   POST /api/v1/posts/public/get
// @access  Public (Only need Admin Public Access Key)
router.route('/public/get')
  .post(adminAccessPublic, getPublicPost)

// @desc    Portfolio V4 Posts (Update Post Like)
// @route   POST /api/v1/posts/public/update
// @access  Public (Only need Admin Public Access Key)
router.route('/public/update')
  .post(adminAccessPublic, updatePublicPost)

// @desc    Portfolio V4 Posts Dashboard (Get All Posts)
// @route   POST /api/v1/posts/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivatePosts)
  // .get(getPrivatePosts)

// @desc    Portfolio V4 Posts Dashboard (Add A Post)
// @route   POST /api/v1/posts/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, uploadImgFile.single('file'), addPrivatePost)
  // .post(uploadImgFile.single('file'), addPrivatePost)

// @desc    Portfolio V4 Posts Dashboard (Update A Post Img)
// @route   POST /api/v1/posts/private/update/image
// @access  Private (Require sessionId & uid)
router.route('/private/update/image')
  .post(redirect2Login, uploadImgFile.single('file'), updatePrivatePostImg)
  // .post(uploadImgFile.single('file'), updatePrivatePostImg)

// @desc    Portfolio V4 Posts Dashboard (Update A Post Publishment)
// @route   POST /api/v1/posts/private/update/publish
// @access  Private (Require sessionId & uid)
router.route('/private/update/publish')
  .post(redirect2Login, uploadImgFile.single('file'), updatePrivatePostPublish)
  // .post(updatePrivatePostPublish)

// @desc    Portfolio V4 Posts Dashboard (Update A Post)
// @route   POST /api/v1/posts/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivatePost)
  // .post(updatePrivatePost)

// @desc    Portfolio V4 Posts Dashboard (Delete A Post)
// @route   POST /api/v1/posts/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .post(redirect2Login, deletePrivatePost)
  // .post(deletePrivatePost)

/** Export */
module.exports = router