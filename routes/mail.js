/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, adminAccessPublic,
} = require('../controllers')
// Project Methods
const { 
  getPublicContactStatus,
  addPublicMail,
  getPrivateMails,
  updatePrivateMailNoty, updatePrivateMailRead, updatePrivateMailReply,
  deletePrivateMail, 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/mails/public/get/status
// @access  Public (Only need Admin Public Access Key)
router.route('/public/get/status')
  .post(adminAccessPublic, getPublicContactStatus)

// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/mails/public/add
// @access  Public (Only need Admin Public Access Key)
router.route('/public/add')
  .post(adminAccessPublic, addPublicMail)

// @desc    Portfolio V4 Mail Dashboard (Get All Mails)
// @route   POST /api/v1/mails/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateMails)
  // .get(getPrivateMails)

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Noty)
// @route   POST /api/v1/mails/private/update/noty
// @access  Private (Require sessionId & uid)
router.route('/private/update/noty')
  .post(redirect2Login, updatePrivateMailNoty)
  // .post(updatePrivateMailNoty)

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Read)
// @route   POST /api/v1/mails/private/update/read
// @access  Private (Require sessionId & uid)
router.route('/private/update/read')
  .post(redirect2Login, updatePrivateMailRead)
  // .post(updatePrivateMailRead)

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Reply)
// @route   POST /api/v1/mails/private/update/reply
// @access  Private (Require sessionId & uid)
router.route('/private/update/reply')
  .post(redirect2Login, updatePrivateMailReply)
  // .post(updatePrivateMailReply)

// @desc    Portfolio V4 Mail Dashboard (Delete A Mail)
// @route   POST /api/v1/mails/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .post(redirect2Login, deletePrivateMail)
  // .post(deletePrivateMail)

/** Export */
module.exports = router