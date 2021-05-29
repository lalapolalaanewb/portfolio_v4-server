/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, adminAccessPublic,
} = require('../controllers')
// Project Methods
const { getPublicUserFooterPublic, getPublicUserHome, getPublicUserAbout, getPublicUserResume, getPrivateUsers, addPrivateUser, updatePrivateUserActive, updatePrivateUser, deletePrivateUser } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Footer Public (Get A User)
// @route   POST /api/v1/users/getfooterpublic
// @access  Public (Only need Admin Public Access Key)
router.route('/getfooterpublic')
  .post(adminAccessPublic, getPublicUserFooterPublic)

// @desc    Portfolio V4 Home Page (Get A User)
// @route   POST /api/v1/users/gethome
// @access  Public (Only need Admin Public Access Key)
router.route('/gethome')
  .post(adminAccessPublic, getPublicUserHome)

// @desc    Portfolio V4 About Page (Get A User)
// @route   POST /api/v1/users/getabout
// @access  Public (Only need Admin Public Access Key)
router.route('/getabout')
.post(adminAccessPublic, getPublicUserAbout)

// @desc    Portfolio V4 Resume Page (Get A User)
// @route   POST /api/v1/users/getresume
// @access  Public (Only need Admin Public Access Key)
router.route('/getresume')
.post(adminAccessPublic, getPublicUserResume)

// @desc    Portfolio V4 Users Dashboard (Get All Users)
// @route   POST /api/v1/users/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateUsers)
  // .get(getPrivateUsers)

// @desc    Portfolio V4 Users Dashboard (Add A User)
// @route   POST /api/v1/users/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateUser)
  // .post(addPrivateUser)

// @desc    Portfolio V4 Users Dashboard (Update A User Activeation)
// @route   POST /api/v1/users/private/update/active
// @access  Private (Require sessionId & uid)
router.route('/private/update/active')
  .post(redirect2Login, updatePrivateUserActive)
  // .post(updatePrivateUserActive)

// @desc    Portfolio V4 Users Dashboard (Update A User)
// @route   POST /api/v1/users/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateUser)
  // .post(updatePrivateUser)

// @desc    Portfolio V4 Users Dashboard (Delete A User)
// @route   POST /api/v1/users/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateUser)
  // .delete(deletePrivateUser)

router.use('/private/profile', require('./profile'))

/** Export */
module.exports = router