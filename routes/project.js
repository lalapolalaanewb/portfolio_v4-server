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
const {
  getPublicProjects, 
  updatePublicProject, 
  getPrivateProjects, 
  addPrivateProject, 
  updatePrivateProjectimg, 
  updatePrivateProjectPublish, 
  updatePrivateProject, 
  deletePrivateProject
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 Projects (Get All Projects)
// @route   POST /api/v1/projects
// @access  Public (Only need Admin Public Access Key)
router.route('/')
  .post(adminAccessPublic , getPublicProjects)

// @desc    Portfolio V4 Projects (Get Project Like)
// @route   POST /api/v1/projects/public/update
// @access  Public (Only need Admin Public Access Key)
router.route('/public/update')
  .post(adminAccessPublic , updatePublicProject)

// @desc    Portfolio V4 Projects Dashboard (Get All Projects)
// @route   POST /api/v1/projects/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateProjects)
  // .get(getPrivateProjects)

// @desc    Portfolio V4 Projects Dashboard (Add A Project)
// @route   POST /api/v1/projects/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, uploadImgFile.single('file'), addPrivateProject)
  // .post(uploadImgFile.single('file'), addPrivateProject)

// @desc    Portfolio V4 Projects Dashboard (Update A Project Img)
// @route   POST /api/v1/projects/private/update/image
// @access  Private (Require sessionId & uid)
router.route('/private/update/image')
  .post(redirect2Login, uploadImgFile.single('file'), updatePrivateProjectimg)
  // .post(uploadImgFile.single('file'), updatePrivateProjectimg)

// @desc    Portfolio V4 Projects Dashboard (Update A Project Publishment)
// @route   POST /api/v1/projects/private/update/publish
// @access  Private (Require sessionId & uid)
router.route('/private/update/publish')
  .post(redirect2Login, updatePrivateProjectPublish)
  // .post(updatePrivateProjectPublish)

// @desc    Portfolio V4 Projects Dashboard (Update A Project)
// @route   POST /api/v1/projects/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateProject)
  // .post(updatePrivateProject)

// @desc    Portfolio V4 Projects Dashboard (Delete A Project)
// @route   POST /api/v1/projects/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .post(redirect2Login, deletePrivateProject)
  // .post(deletePrivateProject)

/** Export */
module.exports = router