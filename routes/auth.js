/** Dependencies */
// Express Router
const router = require("express").Router();
// Controllers
const {
  // Verification
  redirect2Login, redirect2Home, userIsAuthenticated, userIsActive
} = require('../controllers');
// Project Methods
const { userLogin, userLogout, userRegister, userRegisterOnComment } = require('../methods')

/** Access (For Admin uses only) */
const adminAccess = (req, res, next) => {
  if(req.params.key !== process.env.ADMIN_ACCESS) { 
    if(process.env.NODE_ENV === 'production') return res.redirect('/projects')

    return res.status(401).json({
      sucess: false,
      error: `You are not authorized to access the data!`,
      data: []
    })
  }

  // continue
  next()
}

/** Access (FOr Commented Users' only) */
const adminAccessComment = (req, res, next) => {
  console.log(req.body)
  if(req.body.key !== process.env.ADMIN_ACCESS_COMMENT) { 
    if(process.env.NODE_ENV === 'production') return res.redirect('/projects')

    return res.status(401).json({
      sucess: false,
      error: `Having problem registering your comment. Please try again later.`,
      data: []
    })
  }

  // continue
  next()
}

/** Routes */
// @access    Portfolio V4 Editting Dashboard
// @purpose   User login interface
// @route     /api/v1/auth
router.route('/')
  // .post(redirect2Home, userLogin)
  .post(userLogin)

// @access    Portfolio V4 Editting Dashboard
// @purpose   Log user out
// @route     /api/v1/auth/logout
router.route('/logout')
  .get(redirect2Login, userLogout)

// @access    Portfolio V4 Editting Dashboard
// @purpose   Check user isAuthenticated
// @route     /api/v1/auth/isauth
router.route('/isauth')
  .post(userIsAuthenticated)

// @access    Portfolio V4 Editting Dashboard
// @purpose   Check user isActive
// @route     /api/v1/auth/isactive
router.route('/isactive')
  .post(userIsActive)

// // @access    Portfolio V4 Register
// // @purpose   Register new user
// // @route     /api/v1/auth/register
// router.route('/register/:key')
//   .post(adminAccess, userRegister)

// // @access    Portfolio V4 Register
// // @purpose   Register new user (Commented User)
// // @route     /api/v1/auth/register/commented
// router.route('/register/guest')
//   .post(adminAccessComment, userRegisterOnComment)

// @access    Portfolio V4 Register
// @purpose   Register new user (Commented User)
// @route     /api/v1/auth/register/commented
router.use('/register', require('./register'))

/** Export */
module.exports = router