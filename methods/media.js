/** Dependencies */
// Model - Project
const {
  Media
} = require('../models')
// Controllers
const { 
  // File Uploads
  uploadMultiImgFile, handleImgRemove,
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
    medias: redisAllData.mediasRedis,
    users: redisAllData.usersRedis
  }
}
// set new medias redis data
const setAllMedia = async(redisAllMedia) => {
  await setAsync(`pfv4_medias`, JSON.stringify(redisAllMedia))
}
// handle 'none' input
const handleNoneInput = input => {
  if (input === 'none') return ''
  else return input
}

/** Methods */
// @desc    Portfolio V4 Media Dashboard (Get All Media)
// @route   POST /api/v1/medias/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateMedias = async (req, res, next) => {
  try {
    // get medias & users data from redis
    let redisAllData = await getAllData()
    let medias = redisAllData.medias
    let users = redisAllData.users
    
    medias.forEach(media => {
      users.forEach(user => {
        if(user._id === media.creator) media.creator = {...user}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: medias.length,
      data: medias.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: `Failed to get medias data from Media Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Posts Media (Add Media/s)
// @route   POST /api/v1/medias/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateMedia = async (req, res, next) => {
  try {
    // upload multiple files
    await uploadMultiImgFile(req, res)

    // photos upload limit
    if (req.files.length <= 0) return res.status(200).json({
      success: false,
      error: `You must at least upload 1 image!`,
      data: {}
    })

    // get medias & users data from redis
    let redisAllData = await getAllData()
    let mediasRedis = redisAllData.medias
    let users = redisAllData.users

    // create new media
    let images = []
    req.files.forEach(file => {
      images.push({
        imgSrc: file.originalname,
        imgAlt: file.originalname,
        dimension: 'dimension',
        size: file.size,
        creator: res.locals.userId
      })
    })

    // insert all medias
    let medias = await Media.insertMany(images)
    console.log('medias: before populated'); console.log(medias)
    /** update medias redis */
    // add new added data to medias redis
    medias.forEach(media => mediasRedis.push({...media._doc, _id: media._doc._id.toString(), creator: media._doc.creator.toString()}))
    // set new medias redis
    await setAllMedia(mediasRedis)
    
    // get populated medias
    let newlyAddedIds = []
    medias.forEach(media => {
      newlyAddedIds.push(media._doc._id.toString())
    })
    
    let selectedMedias = mediasRedis.filter(media => newlyAddedIds.includes(media._id))
    selectedMedias.forEach(media => {
      users.forEach(user => {
        if(user._id === media.creator) media.creator = {...user}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: selectedMedias.length,
      data: selectedMedias
    })
  } catch (err) { console.log(err)
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(200).json({
      success: false,
      error: `You can upload only 10 images at a time!`,
      data: err.code
    })
    else return res.status(200).json({
      success: false,
      error: `Failed to add new post media/s from Media Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Media Dashboard (Update A Media Publishment)
// @route   POST /api/v1/medias/private/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateMediaPublish = async (req, res, next) => {
  let { mediaId, intention } = req.body

  // get medias data from redis
  let redisAllData = await getAllData()
  let medias = redisAllData.medias

  await Media.findByIdAndUpdate(
    { _id: mediaId },
    {
      $set: {
        status: (() => intention === 'publish' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update medias redis */
    // update media info
    medias.forEach(state => {
      if(state._id === mediaId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new medias redis
    await setAllMedia(medias)

    let media = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update media publish from Media Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Media Dashboard (Update A Media)
// @route   POST /api/v1/medias/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateMedia = async (req, res, next) => {
  let {
    imgAlt, creator
  } = req.body

  // get medias data from redis
  let redisAllData = await getAllData()
  let medias = redisAllData.medias

  await Media.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        imgAlt: handleNoneInput(imgAlt),
        creator: creator
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update medias redis */
    // update media info
    medias.forEach(state => {
      if(state._id === req.params.id) {
        state.imgAlt = handleNoneInput(imgAlt),
        state.creator = creator
      }
    })
    // set new medias redis
    await setAllMedia(medias)

    let media = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update media data from Media Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Media Dashboard (Delete A Media)
// @route   POST /api/v1/medias/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateMedia = async (req, res, next) => {
  try {
    // get techs data from redis
    let redisAllData = await getAllData()
    let medias = redisAllData.medias

    // check if media is published first
    let media = await Media.findById(req.params.id)
    if (media) {
      if (media.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete media! Please unpublished the media first.`,
        data: {}
      })
    }

    // - remove image from server images folder
    handleImgRemove(res, media.imgSrc)

    // delete media
    await Media.deleteOne({ _id: req.params.id })

    /** update medias redis */
    // delete media
    let filtered = medias.filter(state => state._id !== req.params.id)
    // set new medias redis
    await setAllMedia(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: `Failed to delete media data from Media Collection`,
      data: err
    })
  }
}