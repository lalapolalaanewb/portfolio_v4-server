/** Dependencies */
// Express Router
const router = require("express").Router()

/** Routes */
// @desc    Portfolio V4 User Profile (Get A User's Personal)
// @route   POST /api/v1/users/private/profile/personal
// @access  Private (Require sessionId & uid) 
router.use('/personal', require('./personal'))

// @desc    Portfolio V4 User Profile (Get A User's Home)
// @route   POST /api/v1/users/private/profile/home
// @access  Private (Require sessionId & uid) 
router.use('/home', require('./home'))

// @desc    Portfolio V4 User Profile (Get A User's About)
// @route   POST /api/v1/users/private/profile/about
// @access  Private (Require sessionId & uid) 
router.use('/about', require('./about'))

// @desc    Portfolio V4 User Profile (Get A User's Social)
// @route   POST /api/v1/users/private/profile/social
// @access  Private (Require sessionId & uid) 
router.use('/social', require('./social'))

// @desc    Portfolio V4 User Profile (Get A User's Education)
// @route   POST /api/v1/users/private/profile/education
// @access  Private (Require sessionId & uid) 
router.use('/education', require('./education'))

// @desc    Portfolio V4 User Profile (Get A User's Job)
// @route   POST /api/v1/users/private/profile/job
// @access  Private (Require sessionId & uid) 
router.use('/job', require('./job'))

// @desc    Portfolio V4 User Profile (Get A User's Resume)
// @route   POST /api/v1/users/private/profile/resume
// @access  Private (Require sessionId & uid) 
router.use('/resume', require('./resume'))

/** Export */
module.exports = router