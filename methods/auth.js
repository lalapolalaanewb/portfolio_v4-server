/** Dependencies */
// JWT
const jwt = require('jsonwebtoken')
// Bcrypt
const bcrypt = require('bcryptjs')
// Model - Project
const {
  User
} = require('../models')
// Controllers
const {
  // Redis Data
  setDefaultAllData,
  // Session
  SESS_ABSOULTE_TIMEOUT,
  // Verification
  logIn, logOut,
  // Validation
  registerValidation
} = require('../controllers')

/** Methods */

// @desc    Allow user login
// @route   POST /api/v1/auth
// @access  Private
exports.userLogin = async(req, res, next) => {
  try {
    const { email, password } = req.body
    // console.log(req.body)
    // check user exist
    const userExist = await User.findOne({ 'credentials.emails.main': email })
    if(!userExist) return res.status(401).json({
      success: false,
      error: `Incorrect username or password.`,
      data: {}
    })
    
    // check if password matched
    const valiPassword = await bcrypt.compare(password, userExist.credentials.password)
    if(!valiPassword) return res.status(401).json({
      success: false,
      error: `Incorrect password or username.`,
      data: {}
    })
    
    // assign new session data for user
    await logIn(req, userExist._id); // console.log(req.sessionID); console.log(req.session)

    // set all available data to redis
    await setDefaultAllData()

    // return with success message
    return res.status(200).json({
      success: true,
      count: userExist.length,
      data: {
        sessionID: req.sessionID,
        uid: userExist._id,
        email: userExist?.credentials?.emails?.main
        // sato: req.session.createdAt + SESS_ABSOULTE_TIMEOUT
        // sato: (req.session.createdAtReact).setTime((req.session.createdAtReact).getTime() + SESS_ABSOULTE_TIMEOUT)
      }
    })
  } catch(err) {
    // return with error message
    return res.status(500).json({
      success: false,
      count: 0,
      error: 'Having trouble checking the credentials. Please try login later.',
      data: err
    })
  }

  // return await Project.find().sort({ createdAt: 1 })
  // .populate('techs')
  // .then(data => {
  //   return res.status(200).json({
  //     success: true,
  //     count: data.length,
  //     data: data
  //   })
  // })
  // .catch(err => {
  //   return res.status(500).json({
  //     success: false,
  //     error: `Failed to get data from Projects Collection`,
  //     data: err
  //   })
  // })
}

// @desc    Log user out
// @route   POST /api/v1/auth/logout
// @access  Private
exports.userLogout = async(req, res, next) => {
  await logOut(req, res)
}

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Private
exports.userRegister = async(req, res, next) => {
  let {
    email, password, passwordConfirm, 
    firstName, lastName, nickName,
  } = req.body

  // do server validation
  const { error } = registerValidation(req.body)
  if(error) return res.status(406).json({
    success: false,
    error: error.details[0].message,
    data: {}
  })

  // check if user already exist
  const userExist = await User.findOne({ 'credentials.emails.main': email })
  if(userExist) return res.status(400).json({
    success: false,
    error: `User already exists.`,
    data: {}
  })

  // hashed password
  const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt(12))

  // create new user object
  const user = new User({
    // name
    name: {
      // firstName
      firstName: firstName,
      // lastName
      lastName: lastName,
      // nickName
      nickName: nickName
    },
    // credentials
    credentials: {
      emails: {
        // main
        main: email,
        // backup
        backup: ''
      },
      // password
      password: passwordHashed
    }
  })

  // save new user
  user.save()
  .then(user => {
    return res.status(202).json({
      success: true,
      count: user.length,
      data: user
    })
  })
  .catch(err => {
    res.status(500).json({
      success: false,
      error: `Having trouble saving new user info in db. Please try again later.`,
      data: err
    })
  })
}

// @desc    Register new user (Like User's only)
// @route   POST /api/v1/auth/register/like
// @access  Public
exports.userRegisterOnLike = async(req, res, next) => {
  let {
    uid
  } = req.body

  // check if user already exist
  const userExist = await User.findById(uid)
  if(userExist) return res.status(200).json({
    success: true,
    count: userExist.length,
    data: userExist._id
  }) 
  else return res.status(200).json({
    success: false,
    error: `User doesn't exists`,
    data: {}
  })
}

// @desc    Register new user (Commented User's only)
// @route   POST /api/v1/auth/register/comment
// @access  Public
exports.userRegisterOnComment = async(req, res, next) => {
  let {
    email, 
    nickName,
    statusOpt
  } = req.body

  if(statusOpt === 'addComment') {
    // check if user already exist
    const userExist = await User.findOne({ 'credentials.emails.main': email })
    if(userExist) return res.status(200).json({
      success: true,
      count: userExist.length,
      data: userExist._id
    })
  }

  // hashed password
  const passwordHashed = await bcrypt.hash(process.env.COMMENTED_USER_PASSWORD, await bcrypt.genSalt(12))

  // create new user object
  const user = new User({
    // name
    name: {
      // firstName
      firstName: '',
      // lastName
      lastName: '',
      // nickName
      nickName: nickName
    },
    // credentials
    credentials: {
      emails: {
        // main
        main: email,
        // backup
        backup: ''
      },
      // password
      password: passwordHashed
    }
  })

  // save new user
  user.save()
  .then(user => {
    return res.status(202).json({
      success: true,
      count: user.length,
      data: user._id
    })
  })
  .catch(err => {
    res.status(500).json({
      success: false,
      error: `Having trouble registering your comment. Please try again later.`,
      data: err
    })
  })
}