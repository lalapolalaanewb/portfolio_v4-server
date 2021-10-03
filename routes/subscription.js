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
  addPublicSubscription,
  getPrivateSubscriptions,
  updatePrivateSubscriptionNoty, updatePrivateSubscriptionRead, updatePrivateSubscriptionReply,
  deletePrivateSubscription
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 Subscription (Add A Subscription)
// @route   POST /api/v1/subscriptions/public/add
// @access  Public (Only need Admin Public Access Key)
router.route('/public/add')
  .post(adminAccessPublic, addPublicSubscription)

// @desc    Portfolio V4 Subscription Dashboard (Get All Subscriptions)
// @route   POST /api/v1/subscriptions/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  // .get(redirect2Login, getPrivateSubscriptions)
  .get(getPrivateSubscriptions)

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Noty)
// @route   POST /api/v1/subscriptions/private/update/noty
// @access  Private (Require sessionId & uid)
router.route('/private/update/noty')
  .post(redirect2Login, updatePrivateSubscriptionNoty)
  // .post(updatePrivateSubscriptionNoty)

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Read)
// @route   POST /api/v1/subscriptions/private/update/read
// @access  Private (Require sessionId & uid)
router.route('/private/update/read')
  .post(redirect2Login, updatePrivateSubscriptionRead)
  // .post(updatePrivateSubscriptionRead)

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Reply)
// @route   POST /api/v1/subscriptions/private/update/reply
// @access  Private (Require sessionId & uid)
router.route('/private/update/reply')
  .post(redirect2Login, updatePrivateSubscriptionReply)
  // .post(updatePrivateSubscriptionReply)

// @desc    Portfolio V4 Subscription Dashboard (Delete A Subscription)
// @route   POST /api/v1/subscriptions/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateSubscription)
  // .delete(deletePrivateSubscription)

/** Export */
module.exports = router