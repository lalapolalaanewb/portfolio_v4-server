/** Dependencies */
// Model - Skill
const {
  Skill, User
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
    skills: redisAllData.skillsRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
}
// set new skills redis data
const setAllSkill = async(redisAllSkill) => {
  await setAsync(`pfv4_skills`, JSON.stringify(redisAllSkill))
}
// set new users redis data
const setAllUser = async(redisAllUser) => {
  await setAsync(`pfv4_users`, JSON.stringify(redisAllUser))
}
// handle getting techIds
const handleGetTechIds = async (techs, techNames) => {

  // let techObjIds = await Technology.find().select('_id').where('name').in(techNames).exec()
  let techObjIds = techs.filter(tech => techNames.includes(tech.name))
  if(!techObjIds) return res.status(200).json({
    success: false,
    error: `No tech found or match with Technology Collection`,
    data: {}
  })

  let techIds = []
  techObjIds.forEach(objId => techIds.push(objId._id))

  return techIds
}

/** Methods */

// @desc    Portfolio V4 Skills (Get All Skills)
// @route   POST /api/v1/skills
// @access  Public (Only need Admin Public Access Key)
exports.getPublicSkills = async(req, res, next) => {
  try {
    // get skills & users data from redis
    let redisAllData = await getAllData()
    let skills = redisAllData.skills
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(200).json({
      success: false,
      error: `No active user found.`,
      data: {}
    })

    // get active user skills
    let userSkills = skills.filter(skill => skill.creator === user._id)

    // get populated skills (techs)
    userSkills.forEach(skill => {
      let techsPopulated = []
      skill.techs.forEach(state => {
        techs.forEach(tech => {
          if(tech._id === state) techsPopulated.push({...tech})
        })
      })
      skill.techs = techsPopulated
    })

    return res.status(200).json({
      success: true,
      count: userSkills.length,
      data: userSkills.sort((a, b) => a.name < b.name ? -1 : 1)
    })
  } catch(err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to get skills data from Skill Collection`,
      data: err
    })
  }

  // let user = await User.findOne({ status: 1 })
  // if(!user) return res.status(400).json({
  //   success: false,
  //   error: `No active user found from User Collection`,
  //   data: {}
  // })
  
  // await Skill.find().where({ creator: user._id }).sort({ name: 1 })
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
  //     error: `Failed to get data from Skill Collection`,
  //     data: err
  //   })
  // })
}

// @desc    Portfolio V4 Skills Dashboard (Get All Skills)
// @route   POST /api/v1/skills/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateSkills = async(req, res, next) => {
  try {
    // get skills, techs, users data from redis
    let redisAllData = await getAllData()
    let skills = redisAllData.skills
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get populated skills (with creator)
    skills.forEach(skill => {
      users.forEach(user => {
        if(user._id === skill.creator) skill.creator = {...user}
      })
    })
    // get populated skills (with techs)
    skills.forEach(skill => {
      let techsPopulated = []
      skill.techs.forEach(state => {
        techs.forEach(tech => {
          if(tech._id === state) techsPopulated.push({...tech})
        })
      })
      skill.techs = techsPopulated
    })

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills.sort((a, b) => a._id > b._id ? -1 : 1)
    })
  } catch(err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to get skills data from Skill Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Skills Dashboard (Add A Skill)
// @route   POST /api/v1/skills/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateSkill = async(req, res, next) => {
  let {
    name, techs
  } = req.body 

  // get skills, techs, users data from redis
  let redisAllData = await getAllData()
  let skills = redisAllData.skills
  let techsRedis = redisAllData.techs
  let users = redisAllData.users
  
  let techIds = await handleGetTechIds(techsRedis, techs)
  
  const newSkill = new Skill({
    name: name,
    techs: techIds,
    creator: res.locals.userId // add current logged-in user ID
  })

  newSkill.save()
  .then(async data => {
    await User.updateOne(
      { _id: res.locals.userId },
      { $push: { skills: data._id } },
    )

    /** update skills & users redis */
    // add new added data to skills redis
    skills.push(data)
    // set new skills redis
    await setAllSkill(skills)
    // add & update new skill id to user/creator data
    users.forEach(user => {
      if(user._id === res.locals.userId) user.skills.push(data._id)
    })
    // set new users redis
    await setAllUser(users)

    let skill = await data.populate('techs').populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: skill.length,
      data: skill
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to add new skill data to Skill Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Skills Dashboard (Update A Skill)
// @route   POST /api/v1/skills/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateSkill = async(req, res, next) => {
  let {
    name, techs, creator
  } = req.body

  // get skills, techs, users data from redis
  let redisAllData = await getAllData()
  let skills = redisAllData.skills
  let techsRedis = redisAllData.techs
  let users = redisAllData.users

  let techIds = await handleGetTechIds(techsRedis, techs)
  let shouldCreatorUpdate
  creator.current === creator.new ? shouldCreatorUpdate = 'no' : shouldCreatorUpdate = 'yes'

  await Skill.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: name,
      techs: techIds,
      creator: shouldCreatorUpdate === 'no' ? creator.current : creator.new
    } },
    { new: true }
  )
  .then(async data => {
    if(shouldCreatorUpdate === 'yes') {
      // remove from user before
      await User.updateOne(
        { _id: creator.current },
        { $pull: { skills: req.params.id } },
      )
      // add to new user
      await User.updateOne(
        { _id: creator.new },
        { $push: { skills: req.params.id } },
      )

      /** update users redis */
      // remove from user before
      users.forEach(user => {
        if(user._id === creator.current) {
          let filtered = user.skills.filter(state => state !== req.params.id)
          user.skills = filtered
        }
      })
      // add to new user
      users.forEach(user => {
        if(user._id === creator.new) user.skills.push(req.params.id)
      })
      // set new users redis
      await setAllUser(users)
    }

    /** update skills redis */
    // update skill info
    skills.forEach(state => {
      if(state._id === req.params.id) {
        state.name = name
        state.techs = techIds
        state.creator = shouldCreatorUpdate === 'no' ? creator.current : creator.new
      }
    })
    // set new skills redis
    await setAllSkill(skills)

    let skill = await data.populate('techs').populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: skill.length,
      data: skill
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update skill data from Skill Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Skills Dashboard (Delete A Skill)
// @route   POST /api/v1/skills/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateSkill = async(req, res, next) => {
  try {
    // get skills, techs, users data from redis
    let redisAllData = await getAllData()
    let skills = redisAllData.skills
    let users = redisAllData.users

    // check if akills being used by users
    // let skillsUsed = []
    // users.forEach(user => {
    //   user.skills.forEach(state => {
    //     skills.forEach(skill => {
    //       if(skill._id === state) skillsUsed.push(skill._id)
    //     })
    //   })
    // })
    // if(skillsUsed.length > 0) return res.status(400).json({
    //   success: false,
    //   error: `Skill/s are being used by user/s. Please delete from user/s first.`,
    //   data: {}
    // })

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { skills: req.params.id } },
    )

    // delete skill
    await Skill.deleteOne({ _id: req.params.id })

    /** update skills redis */
    // delete skill
    let filtered = skills.filter(state => state._id !== req.params.id)
    // set new skills redis
    await setAllSkill(filtered)
    // remove deleted skill from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.skills.filter(state => state !== req.params.id)
        user.skills = filtered
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
    return res.status(200).json({
      success: false,
      error: `Failed to delete skill data from SKill Collection`,
      data: err
    })
  }
}