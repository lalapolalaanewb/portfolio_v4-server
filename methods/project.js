// Model - Project
const {
  Project, Likestatus, Technology, User
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
    likeStatusesTemp: redisAllData.likeStatusesTempRedis,
    projects: redisAllData.projectsRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
}
// set new likeStatusesTemp redis data
const setAllLikeStatusTemp = async(redisAllLikeStatusesTemp) => {
  await setAsync(`pfv4_likeStatusesTemp`, JSON.stringify(redisAllLikeStatusesTemp))
} 
// set new projects redis data
const setAllProject = async(redisAllProject) => {
  await setAsync(`pfv4_projects`, JSON.stringify(redisAllProject))
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
// handle getting techIds
const handleGetTechIds = async (techs, techNames) => {

  // let techObjIds = await Technology.find().select('_id').where('name').in(techNames).exec()
  let techObjIds = techs.filter(tech => techNames.includes(tech.name))
  if(!techObjIds) return res.status(500).json({
    success: false,
    error: `No tech found or match with Technology Collection`,
    data: {}
  })

  let techIds = []
  techObjIds.forEach(objId => techIds.push(objId._id))

  return techIds
}

// continuous timer
// let now = new Date()
// let millisTill6 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 28, 0, 0) - now
// console.log(millisTill6)
// if (millisTill6 < 0) { // wait 24hours to trigger again
//   millisTill6 += 86400000 // it's after 10am, try 10am tomorrow.
// }
// setTimeout(function(){console.log("It's 4.28pm!")}, millisTill6)

/** Methods */
// @desc    Portfolio V4 Projects
// @route   POST /api/v1/projects
// @access  Public (Only need Admin Public Access Key)
exports.getPublicProjects = async(req, res, next) => {
  try {
    // get projects, techs, users data from redis
    let redisAllData = await getAllData()
    let projects = redisAllData.projects
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get active projects info
    let projectsActive = projects.filter(project => project.status === 1)
    // get populated projects (with creator)
    projectsActive.forEach(project => {
      users.forEach(user => {
        if(user._id === project.creator) project.creator = {...user}
      })
    })
    // get populated projects (with techs)
    projectsActive.forEach(project => {
      let techsPopulated = []
      project.techs.forEach(state => {
        techs.forEach(tech => {
          if(tech._id === state) techsPopulated.push({...tech})
        })
      })
      project.techs = techsPopulated
    })
    
    return res.status(200).json({
      success: true,
      count: projectsActive.length,
      data: projectsActive.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    })
  }
  catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to get projects data from Projects Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Projects (Get Project Like)
// @route   POST /api/v1/projects/public/update
// @access  Public (Only need Admin Public Access Key)
exports.updatePublicProject = async(req, res, next) => {
  try {
    let {
      project, user
    } = req.body
    // return console.log(req.body)
    // get likeStatusesTemp, projects, techs, users data from redis
    let redisAllData = await getAllData()
    let likeStatusesTemp = redisAllData.likeStatusesTemp

    // check if user likeStatusesTemp exist
    let likeStatus = likeStatusesTemp.find(state => state.ipv4 === user)
    if(!likeStatus) likeStatusesTemp.push({
      ipv4: user,
      likedProjects: [{ projectId: project._id, status: project.status }],
      likedPosts: []
    }) 
    else {
      likeStatusesTemp.forEach(state => {
        if(state.ipv4 === user) {
          let isLikedExist = false
          state.likedProjects.forEach(liked => {
            if(liked.projectId === project._id) {
              liked.status = project.status
              isLikedExist = true
            }
          })
          if(isLikedExist === false) state.likedProjects.push({ projectId: project._id, status: project.status })
        }
      })
    }
    console.log(likeStatusesTemp)
    // set new likeStatusesTemp redis
    await setAllLikeStatusTemp(likeStatusesTemp)

    return res.status(200).json({
      success: true,
      count: 1,
      data: {}
    })
  }
  catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to update project data from Projects Collection`,
      data: err
    })
  }

  // return await Likestatus.find({ ipv4: req.body.ipv4 })
  // .then(async data => {
  //   data.likedProjects.map(proj => {
  //     if(proj.projectId === req.body.projectId) status = proj.status 
  //   })

  //   if(status) return await Project.findByIdAndUpdate(
  //     { _id: req.body.projectId },
  //     { $set: { like: +req.body.projectLikeCount - 1 } }
  //   )
  //   else return await Project.findByIdAndUpdate(
  //     { _id: req.body.projectId },
  //     { $set: { like: +req.body.projectLikeCount + 1 } }
  //   )
  // })
  // .then(async data => {
  //   return await Likestatus.updateOne(
  //     { ipv4: req.body.ipv4 },
  //     { $set: { "likedProjects.$[projectId].status": !status } },
  //     { arrayFilters: [{ "projectId.projectId": req.body.projectId }] }
  //   )
  // })
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
  //     error: `Failed to update data from Projects & Likestatus Collection`,
  //     data: err
  //   })
  // })
}

// @desc    Portfolio V4 Projects Dashboard (Get All Projects)
// @route   POST /api/v1/projects/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateProjects = async(req, res, next) => {
  try {
    // get projects, techs, users data from redis
    let redisAllData = await getAllData()
    let projects = redisAllData.projects
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get populated projects (with creator)
    projects.forEach(project => {
      users.forEach(user => {
        if(user._id === project.creator) project.creator = {...user}
      })
    })
    // get populated projects (with techs)
    projects.forEach(project => {
      let techsPopulated = []
      project.techs.forEach(state => {
        techs.forEach(tech => {
          if(tech._id === state) techsPopulated.push({...tech})
        })
      })
      project.techs = techsPopulated
    })
    
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    })
  }
  catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to get projects data from Projects Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Projects Dashboard (Add A Project)
// @route   POST /api/v1/projects/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateProject = async(req, res, next) => {
  let {
    name,
    www, code,
    techs,
    description,
    subDescription,
  } = req.body

  // get projects, techs, users data from redis
  let redisAllData = await getAllData()
  let projects = redisAllData.projects
  let techsRedis = redisAllData.techs
  let users = redisAllData.users

  let techNames = techs.split(',')
  let techIds = await handleGetTechIds(techsRedis, techNames)
  
  const project = new Project({
    name: name,
    imgSrc: req.file.originalname,
    description: handleNoneInput(description),
    subDescription: handleNoneInput(subDescription),
    liveUrls: {
      www: handleNoneInput(www),
      code: handleNoneInput(code)
    },
    techs: techIds,
    publishedAt: new Date(Date.now()).toISOString(),
    creator: req.session.userId // add current logged-in user ID
  })

  project.save()
  .then(async data => {
    await User.updateOne(
      { _id: req.session.userId },
      { $push: { projects: data._id } },
    )

    /** update projects & users redis */
    // add new added data to projects redis
    projects.push(data)
    // set new projects redis
    await setAllProject(projects)
    // add & update new project id to user/creator data
    users.forEach(user => {
      if(user._id === req.session.userId) user.projects.push(data._id)
    })
    // set new users redis
    await setAllUser(users)
    
    let project = await data.populate('techs').populate('creator').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: project.length,
      data: project
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to add new project data from Projects Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Projects Dashboard (Update A Project Img)
// @route   POST /api/v1/projects/private/update/image
// @access  Private (Require sessionId & uid)
exports.updatePrivateProjectimg = async(req, res, next) => {
  let { projectId, imgSrc } = req.body

  // - remove image from server images folder
  handleImgRemove(res, imgSrc)

  // get projects data from redis
  let redisAllData = await getAllData()
  let projects = redisAllData.projects

  await Project.findByIdAndUpdate(
    { _id: projectId },
    { $set: { imgSrc: req.file.originalname } },
    { new: true }
  )
  .then(async data => {
    /** update projects redis */
    // update project info
    projects.forEach(state => {
      if(state._id === projectId) state.imgSrc = req.file.originalname
    })
    // set new projects redis
    await setAllProject(projects)

    let project = await data.populate('techs').populate('creator').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: project.length,
      data: project
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update project image from Projects Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Projects Dashboard (Update A Project Publishment)
// @route   POST /api/v1/projects/private/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateProjectPublish = async(req, res, next) => {
  let { projectId, intention } = req.body

  // get projects data from redis
  let redisAllData = await getAllData()
  let projects = redisAllData.projects
  
  await Project.findByIdAndUpdate(
    { _id: projectId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update projects redis */
    // update project info
    projects.forEach(state => {
      if(state._id === projectId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new projects redis
    await setAllProject(projects)

    let project = await data.populate('techs').populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: project.length,
      data: project
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update project publish from Projects Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Projects Dashboard (Update A Project)
// @route   POST /api/v1/projects/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateProject = async(req, res, next) => {
  let {
    name, www, code, description, subDescription, techs, creator
  } = req.body

  // get projects, techs, users data from redis
  let redisAllData = await getAllData()
  let projects = redisAllData.projects
  let techsRedis = redisAllData.techs
  let users = redisAllData.users
  
  let techIds = await handleGetTechIds(techsRedis, techs)
  let shouldCreatorUpdate
  creator.current === creator.new ? shouldCreatorUpdate = 'no' : shouldCreatorUpdate = 'yes'
  
  await Project.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: name,
      liveUrls: {
        www: handleNoneInput(www),
        code: handleNoneInput(code)
      },
      techs: techIds,
      description: handleNoneInput(description),
      subDescription: handleNoneInput(subDescription),
      // like: like,
      creator: shouldCreatorUpdate === 'no' ? creator.current : creator.new
    } },
    { new: true }
  )
  .then(async data => {
    if(shouldCreatorUpdate === 'yes') {
      // remove from user before
      await User.updateOne(
        { _id: creator.current },
        { $pull: { projects: req.params.id } },
      )
      // add to new user
      await User.updateOne(
        { _id: creator.new },
        { $push: { projects: req.params.id } },
      )

      /** update users redis */
      // remove from user before
      users.forEach(user => {
        if(user._id === creator.current) {
          let filtered = user.projects.filter(state => state !== req.params.id)
          user.projects = filtered
        }
      })
      // add to new user
      users.forEach(user => {
        if(user._id === creator.new) user.projects.push(req.params.id)
      })
      // set new users redis
      await setAllUser(users)
    }

    /** update projects redis */
    // update project info
    projects.forEach(state => {
      if(state._id === req.params.id) {
        state.name = name
        state.liveUrls.www = handleNoneInput(www)
        state.liveUrls.code = handleNoneInput(code)
        state.techs = techIds
        state.description = handleNoneInput(description)
        state.subDescription = handleNoneInput(subDescription)
        state.creator = shouldCreatorUpdate === 'no' ? creator.current : creator.new
      }
    })
    // set new projects redis
    await setAllProject(projects)

    let project = await data.populate('techs').populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: project.length,
      data: project
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update project data from Projects Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Projects Dashboard (Delete A Project)
// @route   POST /api/v1/projects/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateProject = async(req, res, next) => {
  try {
    // get projects, techs, users data from redis
    let redisAllData = await getAllData()
    let projects = redisAllData.projects
    let users = redisAllData.users

    // check if project is published first
    let project = projects.find(state => state._id === req.params.id)
    if(project) {
      if(project.status === 1) return res.status(400).json({
        success: false,
        error: `Unable to delete project! Please unpublished the project first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { projects: req.params.id } },
    )

    // - remove image from server images folder
    handleImgRemove(res, project.imgSrc)

    // delete project
    await Project.deleteOne({ _id: req.params.id })

    /** update projects redis */
    // delete project
    let filtered = projects.filter(state => state._id !== req.params.id)
    // set new projects redis
    await setAllProject(filtered)
    // remove deleted project from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.projects.filter(state => state !== req.params.id)
        user.projects = filtered
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
      error: `Failed to delete project data from Project Collection`,
      data: err
    })
  }
}