/** Dependencies */
// Model - Project
const {
  Technology
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
    posts: redisAllData.postsRedis,
    projects: redisAllData.projectsRedis,
    skills: redisAllData.skillsRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
}
// set new techs redis data
const setAllTech = async(redisAllTech) => {
  await setAsync(`pfv4_techs`, JSON.stringify(redisAllTech))
}
// handle extract techs info
const handleTechExtract = (datas, id2Compare) => {
  let datas2Compare = []
  
  datas.forEach(data => {
    data.techs.forEach(tech => {
      // save the tech if categoriesProject array still empty
      if(datas2Compare.length === 0) datas2Compare.push(tech.toString())
      else {
        // check if category already exist in the array, if not , then save
        if(datas2Compare.map(cat => cat).indexOf(tech.toString()) === -1) datas2Compare.push(tech.toString())
      }
    })
  })
  
  // check if id2Compare exist in datas2Compare 
  if(datas2Compare.includes(id2Compare)) return 'exist'
  else return 'not exist'
}

/** Methods */

// @desc    Portfolio V4 Techs Dashboard (Get All Techs)
// @route   POST /api/v1/techs/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateTechs = async(req, res, next) => {
  try {
    // get user data from redis
    let redisAllData = await getAllData()
    let users = redisAllData.users

    // get tech data from redis
    let redisAllTech = redisAllData.techs

    // get populated tech data (with creator data)
    redisAllTech.forEach(tech => {
      users.forEach(user => {
        if(user._id === tech.creator) tech.creator = user
      })
    })

    return res.status(200).json({
      success: true,
      count: redisAllTech.length,
      data: redisAllTech.sort((a, b) => a._id > b._id ? -1 : 1)
    })
  }
  catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get techs from Tech Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Projects Dashboard (Add A Tech)
// @route   POST /api/v1/techs/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateTech = async(req, res, next) => {
  let {
    name, abbreviation
  } = req.body

  // get techs data from redis
  let redisAllData = await getAllData()
  let redisAllTech = redisAllData.techs
  
  const newTech = new Technology({
    name: name,
    abbreviation: abbreviation,
    creator: res.locals.userId // add current logged-in user ID
  })

  newTech.save()
  .then(async data => {
    /** update techs redis */
    // add new added data to techs redis
    redisAllTech.push(data)
    // set new techs redis
    await setAllTech(redisAllTech)

    let tech = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: tech.length,
      data: tech
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to add new tech data to Tech Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Techs Dashboard (Update A Tech)
// @route   POST /api/v1/techs/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateTech = async(req, res, next) => {
  let {
    name, abbreviation, creator
  } = req.body

  // get techs data from redis
  let redisAllData = await getAllData()
  let redisAllTech = redisAllData.techs

  return await Technology.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: name,
      abbreviation: abbreviation,
      creator: creator
    } },
    { new: true }
  )
  .then(async data => {
    /** update techs redis */
    // update tech info
    redisAllTech.forEach(state => {
      if(state._id === req.params.id) {
        state.name = name
        state.abbreviation = abbreviation
        state.creator = creator
      }
    })
    // set new techs redis
    await setAllTech(redisAllTech)

    let tech = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: tech.length,
      data: tech
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update tech data from Tech Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Techs Dashboard (Delete A Tech)
// @route   POST /api/v1/techs/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateTech = async(req, res, next) => {
  try {
    // get techs data from redis
    let redisAllData = await getAllData()
    let redisAllTech = redisAllData.techs

    // check if tech being used in Skill Collection
    if(handleTechExtract(redisAllData.skills, req.params.id) === 'exist') return res.status(200).json({
      success: false,
      error: `Please delete tech data from Skill Collection first`,
      data: {}
    })

    // check if tech being used in Project Collection
    if(handleTechExtract(redisAllData.projects, req.params.id) === 'exist') return res.status(200).json({
      success: false,
      error: `Please delete tech data from Project Collection first`,
      data: {}
    })

    // check if tech being used in Post Collection
    // let posts = await Post.find().where({ tech: req.params.id })
    let posts = redisAllData.posts.filter(state => state.tech === req.params.id)
    if(posts.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete tech data from Post Collection first`,
      data: {}
    })
  
    // delete tech
    await Technology.findByIdAndDelete(req.params.id)

    /** update techs redis */
    // delete tech
    let filtered = redisAllTech.filter(state => state._id !== req.params.id)
    // set new contacts redis
    await setAllTech(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to delete tech data from Tech Collection`,
      data: err
    })
  }
}