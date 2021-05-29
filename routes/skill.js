/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, adminAccessPublic
} = require('../controllers')
// Skill Methods
const { getPublicSkills, getPrivateSkills, addPrivateSkill, updatePrivateSkill, deletePrivateSkill } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Skills (Get All Skills)
// @route   POST /api/v1/skills
// @access  Public (Only need Admin Public Access Key)
router.route('/')
  .post(adminAccessPublic, getPublicSkills)

// @desc    Portfolio V4 Skills Dashboard (Get All Skills)
// @route   POST /api/v1/skills/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateSkills)
  // .get(getPrivateSkills)

// @desc    Portfolio V4 Skills Dashboard (Add A Skill)
// @route   POST /api/v1/skills/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateSkill)
  // .post(addPrivateSkill)

// @desc    Portfolio V4 Skills Dashboard (Update A Skill)
// @route   POST /api/v1/skills/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateSkill)
  // .post(updatePrivateSkill)

// @desc    Portfolio V4 Skills Dashboard (Delete A Skill)
// @route   POST /api/v1/skills/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .post(redirect2Login, deletePrivateSkill)
  // .post(deletePrivateSkill)

/** Export */
module.exports = router