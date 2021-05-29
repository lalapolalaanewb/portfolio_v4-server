/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
} = require('../controllers')
// Project Methods
const { getPrivateUserPersonal, updatePrivateUserPersonal, updatePrivateUserPersonalPassword } = require('../methods')

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User)
// @route   POST /api/v1/users/private/profile/personal/get
// @access  Private (Require sessionId & uid)
router.route('/get')
  .get(redirect2Login, getPrivateUserPersonal)
  // .get(getPrivateUserPersonal)

// @desc    Portfolio V4 Users Profile (Update A User Personal)
// @route   POST /api/v1/users/private/profile/personal/update
// @access  Private (Require sessionId & uid)
router.route('/update')
  .post(redirect2Login, updatePrivateUserPersonal)
  // .post(updatePrivateUserPersonal)

// @desc    Portfolio V4 Users Profile (Update A User Personal Password)
// @route   POST /api/v1/users/private/profile/personal/update/password
// @access  Private (Require sessionId & uid)
router.route('/update/password')
  .post(redirect2Login, updatePrivateUserPersonalPassword)
  // .post(updatePrivateUserPersonalPassword)

/** Export */
module.exports = router