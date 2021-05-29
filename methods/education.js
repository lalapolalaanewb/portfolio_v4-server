/** Dependencies */
// Model - User
const {
  User, Education
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
    edus: redisAllData.educationsRedis,
    users: redisAllData.usersRedis
  }
}
// set new educations redis data
const setAllEdu = async(redisAllEdu) => {
  await setAsync(`pfv4_educations`, JSON.stringify(redisAllEdu))
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
// @desc    Portfolio V4 User Profile (Get A User)
// @route   POST /api/v1/users/private/profile/education/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserEducation = async(req, res, next) => {
  try {
    // get users & edus data from redis
    let redisAllData = await getAllData()
    let edus = redisAllData.edus
    let users = redisAllData.users

    // get active user info
    let user = users.find(user => user.status === 1)
    
    // get all user edus
    let userEdus = edus.filter(edu => user.educations.includes(edu._id))
    if(!userEdus) return res.status(400).json({
      success: false,
      error: `Failed to get user's edus data from Education Collection`,
      data: {}
    })

    return res.status(200).json({
      success: true,
      count: userEdus.length,
      data: {
        _id: user._id,
        educations: userEdus.sort((a, b) => a.course < b.course ? -1: 1)
      }
    })
  } catch(err) {
    return res.status(500).json({
      success: false,
      error: `Failed to get edus data from Education Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's Education)
// @route   POST /api/v1/users/private/profile/education/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserEducation = async(req, res, next) => {
  let {
    course, title, entity, studyStatus, creator
  } = req.body
  
  // get users & edus data from redis
  let redisAllData = await getAllData()
  let edus = redisAllData.edus
  let users = redisAllData.users

  const education = new Education({ 
    course: handleNoneInput(course),
    title: handleNoneInput(title), 
    entity: handleNoneInput(entity), 
    studyStatus: studyStatus,
    creator: creator 
  })
  
  education.save()
  .then(async data => {
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { educations: data._id } },
    )

    /** update edus & users redis */
    // add new added data to edus redis
    edus.push(data)
    // set new edus redis
    await setAllEdu(edus)
    // add & update new edu id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.educations.push(data._id)
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
    return res.status(500).json({
      success: false,
      error: `Failed to add new education data from Education Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Education)
// @route   POST /api/v1/users/private/profile/education/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserEducation = async(req, res, next) => {
  let {
    eduId, edu
  } = req.body

  // get users & edus data from redis
  let redisAllData = await getAllData()
  let edus = redisAllData.edus

  await Education.findByIdAndUpdate(
    { _id: eduId },
    { $set: {
      course: handleNoneInput(edu.course),
      title: handleNoneInput(edu.title),
      entity: handleNoneInput(edu.entity),
      studyStatus: edu.studyStatus
    } },
    { new: true }
  )
  .then(async data => {
    /** update edus redis */
    // update edu info
    edus.forEach(state => {
      if(state._id === eduId) {
        state.course = handleNoneInput(edu.course)
        state.title = handleNoneInput(edu.title)
        state.entity = handleNoneInput(edu.entity)
        state.studyStatus = edu.studyStatus
      }
    })
    // set new edus redis
    await setAllEdu(edus)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(500).json({
      success: false,
      error: `Failed to update education from Education Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Education Publish)
// @route   POST /api/v1/users/private/profile/education/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserEducationPublish = async(req, res, next) => {
  let { eduId, intention } = req.body

  // get edus data from redis
  let redisAllData = await getAllData()
  let edus = redisAllData.edus
  
  await Education.findByIdAndUpdate(
    { _id: eduId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update edus redis */
    // update edu info
    edus.forEach(state => {
      if(state._id === eduId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new edus redis
    await setAllEdu(edus)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(500).json({
      success: false,
      error: `Failed to update education publish from Education Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Delete A User's Education)
// @route   POST /api/v1/users/private/profile/education/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserEducation = async(req, res, next) => {
  try {
    // get users & edus data from redis
    let redisAllData = await getAllData()
    let edus = redisAllData.edus
    let users = redisAllData.users

    // check if edu is published first
    let edu = edus.find(state => state._id === req.body.eduId)
    if(edu) {
      if(edu.status === 1) return res.status(400).json({
        success: false,
        error: `Unable to delete education! Please unpublished the education first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { educations: req.body.eduId } },
    )

    // delete edu
    await Education.deleteOne({ _id: req.body.eduId })

    /** update edus redis */
    // delete edu
    let filtered = edus.filter(state => state._id !== req.body.eduId)
    // set new edus redis
    await setAllEdu(filtered)
    // remove deleted edu from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.educations.filter(state => state !== req.body.eduId)
        user.educations = filtered
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
      error: `Failed to delete edu data from Education Collection`,
      data: err
    })
  }
}