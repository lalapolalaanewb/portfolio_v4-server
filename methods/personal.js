/** Dependencies */
// Bcrypt
const bcrypt = require('bcryptjs')
// Model - User
const {
  User
} = require('../models')
// Controllers
const {
  // Redis Data
  getDefaultAllData,
  // Redis Promises
  setAsync 
} = require('../controllers')

/** Page Specific Functions */
// get all required data from redis
const getAllUser = async() => {
  const redisAllData = await getDefaultAllData()
  return redisAllData.usersRedis
}
// set new users redis data
const setAllUser = async(redisAllUser) => {
  await setAsync(`pfv4_users`, JSON.stringify(redisAllUser))
}
// handle 'none' input
const handleNoneInput = input => {
  if(input === 'none') return ''
  else return input
}
// handle email 'regex'
const handleEmailRegex = email => {
  const emailRegex = /^.+@[^\.].*\.[a-z]{2,}$/

  return emailRegex.test(email.trim())
}

/** Methods */
// @desc    Portfolio V4 User Profile (Get A User)
// @route   POST /api/v1/users/private/profile/get/personal
// @access  Private (Require sessionId & uid)
exports.getPrivateUserPersonal = async(req, res, next) => {
  try {
    // get users data from redis
    let users = await getAllUser()

    // get active user info
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(400).json({
      success: false,
      error: `Failed to get active user data from User Collection`,
      data: {}
    })

    // get all user jobs
    return res.status(200).json({
      success: true,
      count: 1,
      data: {
        _id: user._id,
        name: user.name,
        credentials: {
          emails: user.credentials.emails
        }
      }
    })
  } catch(err) {
    return res.status(500).json({
      success: false,
      error: `Failed to get user personal data from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Update A User Personal)
// @route   POST /api/v1/users/private/profile/personal/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserPersonal = async(req, res, next) => {
  let {
    userId, personal
  } = req.body

  // get users data from redis
  let users = await getAllUser()
  
  if(personal.emails.backup !== 'none') {
    // check if email (backup) regex correct
    if(!handleEmailRegex(personal.emails.backup)) return res.status(400).json({
      success: false,
      error: `Invalid email backup!`,
      data: {}
    })
  }
 
  await User
  .findByIdAndUpdate(
    { _id: userId },
    { $set: {
      name: {
        firstName: handleNoneInput(personal.name.firstName),
        lastName: handleNoneInput(personal.name.lastName),
        nickName: handleNoneInput(personal.name.nickName)
      },
      'credentials.emails.backup': handleNoneInput(personal.emails.backup)
    } },
    { new: true }
  ).select('name credentials.emails')
  .then(async data => { 
    /** update users redis */
    // update user info
    users.forEach(state => {
      if(state._id === userId) {
        state.name.firstName = handleNoneInput(personal.name.firstName)
        state.name.lastName = handleNoneInput(personal.name.lastName)
        state.name.nickName = handleNoneInput(personal.name.nickName)
        state.credentials.emails.backup = handleNoneInput(personal.emails.backup)
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to update user data from User Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User Personal Password)
// @route   POST /api/v1/users/private/profile/personal/update/password
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserPersonalPassword = async(req, res, next) => {
  let {
    userId, password
  } = req.body

  // get users data from redis
  let users = await getAllUser()
  
  try {
    // check if user exist
    let userExist = users.find(user => user._id === userId)
    if(!userExist) return res.status(400).json({
      success: false,
      error: `User doesn't exist!`,
      data: {}
    })

    // check if user password match
    const validPassword = await bcrypt.compare(password.current, userExist.credentials.password)
    if(!validPassword) return res.status(400).json({
      success: false,
      error: `User's password provided is not valid! Please try again later.`,
      data: {}
    })

    // check if user new password match
    if(password.new.password !== password.new.passwordConfirm) return res.status(400).json({
      success: false,
      error: `New password provided not match! Please try again later.`,
      data: {}
    })

    // hashed new password
    const passwordHashed = await bcrypt.hash(password.new.password, await bcrypt.genSalt(12))

    let user = await User
    .findByIdAndUpdate(
      { _id: userId },
      { $set: {
        'credentials.password': passwordHashed
      } },
      { new: true }
    ).select('name credentials.emails')
    if(!user) return res.status(400).json({
      success: false,
      error: `Error while getting updated data! Please try again later.`,
      data: {}
    })

    /** update users redis */
    // update user info
    users.forEach(state => {
      if(state._id === userId) state.credentials.password = passwordHashed
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: user.length,
      data: user
    })
  } catch(err) {
    return res.status(500).json({
      success: false,
      error: `Failed to update user password from User Collection`,
      data: err
    })
  }
}