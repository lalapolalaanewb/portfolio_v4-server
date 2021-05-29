/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, 
} = require('../controllers')
// Project Methods
const { getPrivateTechs, addPrivateTech, updatePrivateTech, deletePrivateTech } = require('../methods')

/** Routes */
// @desc    Portfolio V4 Techs Dashboard (Get All Techs)
// @route   POST /api/v1/techs/private/get
// @access  Private (Require sessionId & uid)
router.route('/private/get')
  .get(redirect2Login, getPrivateTechs)
  // .get(getPrivateTechs)

// @desc    Portfolio V4 Projects Dashboard (Add A Tech)
// @route   POST /api/v1/techs/private/add/
// @access  Private (Require sessionId & uid)
router.route('/private/add')
  .post(redirect2Login, addPrivateTech)
  // .post(addPrivateTech)

// @desc    Portfolio V4 Techs Dashboard (Update A Tech)
// @route   POST /api/v1/techs/private/update/:id
// @access  Private (Require sessionId & uid)
router.route('/private/update/:id')
  .post(redirect2Login, updatePrivateTech)
  // .post(updatePrivateTech)

// @desc    Portfolio V4 Techs Dashboard (Delete A Tech)
// @route   POST /api/v1/techs/private/delete/:id
// @access  Private (Require sessionId & uid)
router.route('/private/delete/:id')
  .delete(redirect2Login, deletePrivateTech)
  // .delete(deletePrivateTech)

/** Export */
module.exports = router