/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
} = require('../controllers')
// Project Methods
const { getPrivateMedias, addPrivateMedia, updatePrivateMediaPublish, updatePrivateMedia, deletePrivateMedia } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Media Dashboard (Get All Medias)
// @route   POST /api/v1/medias/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateMedias)
  // .get(getPrivateMedias)

// @desc    Portfolio V4 Media Dashboard (Add Media/s)
// @route   POST /api/v1/medias/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateMedia)
  // .post(addPrivateMedia)

// @desc    Portfolio V4 Media Dashboard (Update A Media Publishment)
// @route   POST /api/v1/medias/private/update/publish
// @access  Private (Require sessionId & uid)
router.route('/private/update/publish')
  .post(redirect2Login, updatePrivateMediaPublish)
  // .post(updatePrivateMediaPublish)

// @desc    Portfolio V4 Media Dashboard (Update A Media)
// @route   POST /api/v1/medias/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateMedia)
  // .post(updatePrivateMedia)

// @desc    Portfolio V4 Media Dashboard (Delete A Media)
// @route   POST /api/v1/medias/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateMedia)
  // .delete(deletePrivateMedia)

/** Export */
module.exports = router