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
  getPrivateDashboard,
  updatePrivateDashboardRedisAllData 
} = require('../methods')

/** Routes */
// @desc    Portfolio V4 Dashboard (Get All Counts)
// @route   POST /api/v1/dashboard
// @access  Private (Require sessionId & uid)
router.route('/')
  .get(redirect2Login, getPrivateDashboard)
  // .get(getPrivateDashboard)

// @desc    Portfolio V4 Dashboard (Reset All Redis Data)
// @route   POST /api/v1/dashboard/resetredis
// @access  Private (Require sessionId & uid)
router.route('/resetredis')
  .get(redirect2Login, updatePrivateDashboardRedisAllData)
  // .get(updatePrivateDashboardRedisAllData)

/** Export */
module.exports = router