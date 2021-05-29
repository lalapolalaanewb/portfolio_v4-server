/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
} = require('../controllers')
// Project Methods
const { getPrivateMediaSocials, addPrivateMediaSocial, updatePrivateMediaSocial, deletePrivateMediaSocial } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Media Socials Dashboard (Get All Media Socials)
// @route   POST /api/v1/mediasocials/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateMediaSocials)
  // .post(getPrivateMediaSocials)

// @desc    Portfolio V4 Media Socials Dashboard (Add A Media Social)
// @route   POST /api/v1/mediasocials/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateMediaSocial)
  // .post(addPrivateMediaSocial)

// @desc    Portfolio V4 Media Socials Dashboard (Update A Media Social)
// @route   POST /api/v1/mediasocials/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateMediaSocial)
  // .post(updatePrivateMediaSocial)

// @desc    Portfolio V4 Media Socials Dashboard (Delete A Media Social)
// @route   POST /api/v1/mediasocials/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateMediaSocial)
  // .delete(deletePrivateMediaSocial)

/** Export */
module.exports = router