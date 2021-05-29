/** Dependencies */
// Model - User
const {
  User, Socialmedia
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
const getAllData = async() => {
  const redisAllData = await getDefaultAllData()
  return {
    projects: redisAllData.projectsRedis,
    mediaSocials: redisAllData.mediaSocialsRedis,
    socialMedias: redisAllData.socialMediasRedis,
    users: redisAllData.usersRedis
  }
}
// set new socialMedias redis data
const setAllSocialMedia = async(redisAllSocialMedia) => {
  await setAsync(`pfv4_socialMedias`, JSON.stringify(redisAllSocialMedia))
}
// set new users redis data
const setAllUser = async(redisAllUser) => {
  await setAsync(`pfv4_users`, JSON.stringify(redisAllUser))
}

/** Methods */
// @desc    Portfolio V4 User Profile (Get A User)
// @route   POST /api/v1/users/private/profile/social/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserSocial = async(req, res, next) => {
  try {
    // get mediaSocials, socialMedias & users data from redis
    let redisAllData = await getAllData()
    let mediaSocials = redisAllData.mediaSocials
    let socialMedias = redisAllData.socialMedias
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(400).json({
      success: false,
      error: `No active user found from User Collection`,
      data: {}
    })

    // get populated user (socialMedias)
    let socialsPopulated = []
    user.socialMedias.forEach(state => {
    socialMedias.forEach(social => {
        if(social._id === state) socialsPopulated.push({...social})
      })
    })
    user.socialMedias = socialsPopulated

    // get populated user's socialMedias (icon - mediaSocials)
    user.socialMedias.forEach(social => {
      mediaSocials.forEach(media => {
        if(media._id === social.icon) social.icon = {...media}
      })
    })

    return res.status(200).json({
      success: true,
      count: 1,
      data: user
    })
  } catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to get socials data from Social Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's Social Media)
// @route   POST /api/v1/users/private/profile/social/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserSocial = async(req, res, next) => {
  let {
    name, icon, url, creator
  } = req.body
  
  // get socialMedias & users data from redis
  let redisAllData = await getAllData()
  let socialMedias = redisAllData.socialMedias
  let users = redisAllData.users
  
  const newSocial = new Socialmedia({
    name: name, 
    icon: icon, 
    url: url, 
    creator: creator
  })
  
  newSocial.save()
  .then(async data => {
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { socialMedias: data._id } },
    )

    /** update socialMedias & users redis */
    // add new added data to socialMedias redis
    socialMedias.push(data)
    // set new socialMedias redis
    await setAllSocialMedia(socialMedias)
    // add & update new socialMedia id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.socialMedias.push(data._id)
    })
    // set new users redis
    await setAllUser(users)

    let socialMediasPopulated = await data.populate('icon').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: socialMediasPopulated.length,
      data: socialMediasPopulated
    })
  })
  .catch(err => {
    return res.status(500).json({
      success: false,
      error: `Failed to add new social data from Social Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Social)
// @route   POST /api/v1/users/private/profile/social/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserSocial = async(req, res, next) => {
  let {
    socialId, social
  } = req.body

  // get socialMedias & users data from redis
  let redisAllData = await getAllData()
  let socialMedias = redisAllData.socialMedias

  await Socialmedia.findByIdAndUpdate(
    { _id: socialId },
    { $set: {
      name: social.name,
      icon: social.icon,
      url: social.url
    } },
    { new: true }
  )
  .then(async data => {
    /** update socialMedias redis */
    // update socialMedia info
    socialMedias.forEach(state => {
      if(state._id === socialId) {
        state.name = social.name
        state.icon = social.icon
        state.url = social.url
      }
    })
    // set new socialMedias redis
    await setAllSocialMedia(socialMedias)

    let socialMediasPopulated = await data.populate('icon').execPopulate()

    return res.status(200).json({
      success: true,
      count: socialMediasPopulated.length,
      data: socialMediasPopulated
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update social from Social Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Social Publish)
// @route   POST /api/v1/users/private/profile/social/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserSocialPublish = async(req, res, next) => {
  let { socialId, intention } = req.body

  // get socialMedias & users data from redis
  let redisAllData = await getAllData()
  let socialMedias = redisAllData.socialMedias
  
  await Socialmedia.findByIdAndUpdate(
    { _id: socialId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update socialMedias redis */
    // update socialMedia info
    socialMedias.forEach(state => {
      if(state._id === socialId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new socialMedias redis
    await setAllSocialMedia(socialMedias)

    let socialMediasPopulated = await data.populate('icon').execPopulate()

    return res.status(200).json({
      success: true,
      count: socialMediasPopulated.length,
      data: socialMediasPopulated
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update social publish from Social Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Delete A User's Social Media)
// @route   POST /api/v1/users/private/profile/social/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserSocial = async(req, res, next) => {
  try {
    // get socialMedias & users data from redis
    let redisAllData = await getAllData()
    let socialMedias = redisAllData.socialMedias
    let users = redisAllData.users

    // check if social is published first
    let social = socialMedias.find(state => state._id === req.body.socialId)
    if(social) {
      if(social.status === 1) return res.status(400).json({
        success: false,
        error: `Unable to delete social! Please unpublished the social first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { socialMedias: req.body.socialId } },
    )

    // delete socialMedia
    await Socialmedia.deleteOne({ _id: req.body.socialId })

    /** update socialMedias redis */
    // delete socialMedia
    let filtered = socialMedias.filter(state => state._id !== req.body.socialId)
    // set new socialMedias redis
    await setAllSocialMedia(filtered)
    // remove deleted socialMedia from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.socialMedias.filter(state => state !== req.body.socialId)
        user.socialMedias = filtered
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to delete social data from Social Collection`,
      data: err
    })
  }
}