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
  getPrivateContact, 
  addPrivateContact, 
  updatePrivateContactPublish, updatePrivateContact, 
  deletePrivateContact 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/posts
// @access  Public (Only need Admin Public Access Key)

// @desc    Portfolio V4 Contact Dashboard (Get All Contact)
// @route   POST /api/v1/contacts/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateContact)
  // .get(getPrivateContact)

// @desc    Portfolio V4 Contact Dashboard (Add Contact)
// @route   POST /api/v1/contacts/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateContact)
  // .post(addPrivateContact)

// @desc    Portfolio V4 Contact Dashboard (Update A Contact Status Publish)
// @route   POST /api/v1/contacts/private/update/publish
// @access  Private (Require sessionId & uid)
router.route('/private/update/publish')
  .post(redirect2Login, updatePrivateContactPublish)
  // .post(updatePrivateContactPublish)

// @desc    Portfolio V4 Contact Dashboard (Update A Contact)
// @route   POST /api/v1/contacts/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateContact)
  // .post(updatePrivateContact)

// @desc    Portfolio V4 Contact Dashboard (Delete A Contact)
// @route   POST /api/v1/contacts/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateContact)
  // .delete(deletePrivateContact)

/** Export */
module.exports = router