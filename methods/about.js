/** Dependencies */
// Model - User
const {
  User, About,
} = require('../models')
// Controllers
const {
  // File Upload 
  handleImgRemove,
  // Redis Data
  getDefaultAllData,
  // Redis Promises
  setAsync 
} = require('../controllers')

/** Page Specific Functions */
// get all required data from redis
const getAllData = async() => {
  const redisAllData = await getDefaultAllData()
  return {
    abouts: redisAllData.aboutsRedis,
    users: redisAllData.usersRedis
  }
}
// set new abouts redis data
const setAllAbout = async(redisAllAbout) => {
  await setAsync(`pfv4_abouts`, JSON.stringify(redisAllAbout))
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

/** Methods */
// @desc    Portfolio V4 User Profile (Get A User's About)
// @route   POST /api/v1/users/private/profile/about/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserAbout = async(req, res, next) => {
  try {
    // get users & abouts data from redis
    let redisAllData = await getAllData()
    let users = redisAllData.users
    let abouts = redisAllData.abouts

    // get active user info
    let user = users.find(user => user.status === 1)
    
    // get all user abouts
    let userAbouts = abouts.filter(state => user.abouts.includes(state._id))
    if(!userAbouts) return res.status(200).json({
      success: false,
      error: `Failed to get user's abouts data from About Collection`,
      data: {}
    })
    
    return res.status(200).json({
      success: true,
      count: userAbouts.length,
      data: {
        _id: user._id,
        abouts: userAbouts
      }
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get abouts data from About Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's About)
// @route   POST /api/v1/users/private/profile/about/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserAbout = async(req, res, next) => {
  let {
    title, description, btnPurpose, btnLabel, btnLink, imgPosition, creator
  } = req.body
  
  // get users & abouts data from redis
  let redisAllData = await getAllData()
  let users = redisAllData.users
  let abouts = redisAllData.abouts

  const about = new About({
    title: title,
    description: handleNoneInput(description),
    btnPurpose: btnPurpose,
    btnLabel: btnLabel,
    btnLink: btnLink,
    imgPosition: imgPosition,
    imgSrc: req.file.originalname,
    creator: creator
  })
  
  about.save()
  .then(async data => {
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { abouts: data._id } },
    )

    /** update abouts & users redis */
    // add new added data to techs redis
    abouts.push(data)
    // set new abouts redis
    await setAllAbout(abouts)
    // add & update new about id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.abouts.push(data._id)
    })
    // set new users redis
    await setAllUser(users)
    
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to add new about data from About Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's About)
// @route   POST /api/v1/users/private/profile/about/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserAbout = async(req, res, next) => {
  let {
    aboutId, about
  } = req.body

  // get users & abouts data from redis
  let redisAllData = await getAllData()
  let abouts = redisAllData.abouts

  await About.findByIdAndUpdate(
    { _id: aboutId },
    { $set: {
      title: about.title,
      description: handleNoneInput(about.description),
      btnPurpose: about.btnPurpose,
      btnLabel: about.btnLabel,
      btnLink: about.btnLink,
      imgPosition: about.imgPosition
    } },
    { new: true }
  )
  .then(async data => {
    /** update abouts redis */
    // update about info
    abouts.forEach(state => {
      if(state._id === aboutId) {
        state.title = about.title
        state.description = handleNoneInput(about.description)
        state.btnPurpose = about.btnPurpose
        state.btnLabel = about.btnLabel
        state.btnLink = about.btnLink
        state.imgPosition = about.imgPosition
      }
    })
    // set new abouts redis
    await setAllAbout(abouts)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about from About Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's About Img)
// @route   POST /api/v1/users/private/profile/about/update/image
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserAboutImg = async(req, res, next) => {
  let { aboutId, imgSrc } = req.body

  // - remove image from server images folder
  handleImgRemove(res, imgSrc)

  // get users & abouts data from redis
  let redisAllData = await getAllData()
  let abouts = redisAllData.abouts

  await About.findByIdAndUpdate(
    { _id: aboutId },
    { $set: { imgSrc: req.file.originalname } },
    { new: true }
  )
  .then(async data => {
    /** update abouts redis */
    // update about info
    abouts.forEach(state => {
      if(state._id === aboutId) state.imgSrc = req.file.originalname
    })
    // set new abouts redis
    await setAllAbout(abouts)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about image from About Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's About Publish)
// @route   POST /api/v1/users/private/profile/about/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserAboutPublish = async(req, res, next) => {
  let { aboutId, intention } = req.body

  // get users & abouts data from redis
  let redisAllData = await getAllData()
  let abouts = redisAllData.abouts
  
  await About.findByIdAndUpdate(
    { _id: aboutId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update abouts redis */
    // update about info
    abouts.forEach(state => {
      if(state._id === aboutId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new abouts redis
    await setAllAbout(abouts)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about publish from About Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Delete A User's About)
// @route   POST /api/v1/users/private/profile/about/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserAbout = async(req, res, next) => {
  try {
    // get users & abouts data from redis
    let redisAllData = await getAllData()
    let abouts = redisAllData.abouts
    let users = redisAllData.users

    // check if about is published first
    let about = abouts.find(state => state._id === req.body.aboutId)
    if(about) {
      if(about.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete about! Please unpublished the about first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { abouts: req.body.aboutId } },
    )

    // - remove image from server images folder
    handleImgRemove(res, about.imgSrc)

    // delete about
    await About.deleteOne({ _id: req.body.aboutId })

    /** update abouts redis */
    // delete about
    let filtered = abouts.filter(state => state._id !== req.body.aboutId)
    // set new abouts redis
    await setAllAbout(filtered)
    // remove deleted about from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.abouts.filter(state => state !== req.body.aboutId)
        user.abouts = filtered
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to delete about data from Home Collection`,
      data: err
    })
  }
}