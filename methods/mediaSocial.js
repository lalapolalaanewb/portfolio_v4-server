/** Dependencies */
// Model - Project
const {
  Mediasocial, Socialmedia
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
    mediaSocials: redisAllData.mediaSocialsRedis,
    socialMedias: redisAllData.socialMediasRedis,
    users: redisAllData.usersRedis
  }
}
// set new mediaSocials redis data
const setAllMediaSocial = async(redisAllMediaSocial) => {
  await setAsync(`pfv4_mediaSocials`, JSON.stringify(redisAllMediaSocial))
}

/** Methods */

// @desc    Portfolio V4 Media Socials Dashboard (Get All Media Socials)
// @route   POST /api/v1/mediasocials/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateMediaSocials = async(req, res, next) => {
  try {
    // get mediaSocials & users data from redis
    let redisAllData = await getAllData()
    let mediaSocials = redisAllData.mediaSocials
    let users = redisAllData.users
    
    mediaSocials.forEach(mediaSocial => {
      users.forEach(user => {
        if(user._id === mediaSocial.creator) mediaSocial.creator = {...user}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: mediaSocials.length,
      data: mediaSocials.sort((a, b) => a._id > b._id ? -1 : 1)
    })
  }
  catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to get media social data to Mediasocial Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Media Socials Dashboard (Add A Media Social)
// @route   POST /api/v1/mediasocials/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateMediaSocial = async(req, res, next) => {
  let {
    name, abbreviation
  } = req.body

  // get mediaSocials data from redis
  let redisAllData = await getAllData()
  let mediaSocials = redisAllData.mediaSocials

  const newMediaSocial = new Mediasocial({
    name: name,
    abbreviation: abbreviation,
    creator: res.locals.userId // add current logged-in user ID
  })

  newMediaSocial.save()
  .then(async data => {
    /** update mediaSocials redis */
    // add new added data to mediaSocials redis
    mediaSocials.push(data)
    // set new mediaSocials redis
    await setAllMediaSocial(mediaSocials)

    let mediaSocial = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: mediaSocial.length,
      data: mediaSocial
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to add new media social data to Mediasocial Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Media Socials Dashboard (Update A Media Social)
// @route   POST /api/v1/mediasocials/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateMediaSocial = async(req, res, next) => {
  let {
    name, abbreviation, creator
  } = req.body

  // get mediaSocials data from redis
  let redisAllData = await getAllData()
  let mediaSocials = redisAllData.mediaSocials

  await Mediasocial.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: name,
      abbreviation: abbreviation,
      creator: creator
    } },
    { new: true }
  )
  .then(async data => {
    /** update medias redis */
    // update media info
    mediaSocials.forEach(state => {
      if(state._id === req.params.id) {
        state.name = name
        state.abbreviation = abbreviation
        state.creator = creator
      }
    })
    // set new mediaSocials redis
    await setAllMediaSocial(mediaSocials)

    let mediaSocial = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: mediaSocial.length,
      data: mediaSocial
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update media social data from Mediasocial Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Media Socials Dashboard (Delete A Media Social)
// @route   POST /api/v1/mediasocials/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateMediaSocial = async(req, res, next) => {
  try {
    // get mediaSocials data from redis
    let redisAllData = await getAllData()
    let mediaSocials = redisAllData.mediaSocials
    let socialMedias = redisAllData.socialMedias

    // check if data being use in Socialmedia Model
    // let socialMedias = await Socialmedia.find().where({ icon: req.params.id })
    let socialMediasUsed = socialMedias.filter(socialMedia => socialMedia.icon === req.params.id)
    if(socialMediasUsed.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Socialmedia Collection first`,
      data: {}
    })

    // delete mediaSocial
    await Mediasocial.deleteOne({ _id: req.params.id })

    /** update mediaSocials redis */
    // delete mediaSocial
    let filtered = mediaSocials.filter(state => state._id !== req.params.id)
    // set new mediaSOcials redis
    await setAllMediaSocial(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to delete media social data from Mediasocial Collection`,
      data: err
    })
  }
}