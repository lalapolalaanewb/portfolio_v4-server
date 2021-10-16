/** Dependencies */
// Model - User
const {
  User, Technology, Resume
} = require('../models')
// Controllers
const {
  // File Upload 
  handlePdfRemove,
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
    jobs: redisAllData.jobsRedis,
    projects: redisAllData.projectsRedis,
    resumes: redisAllData.resumesRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
}
// set new resumes redis data
const setAllResume = async(redisAllResume) => {
  await setAsync(`pfv4_resumes`, JSON.stringify(redisAllResume))
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
  if(!techObjIds) return res.status(200).json({
    success: false,
    error: `No tech found or match with Technology Collection`,
    data: {}
  })

  let techIds = []
  techObjIds.forEach(objId => techIds.push(objId._id))

  return techIds
}
// handle empty array
const handleEmptyArray = array => array === '' ? [] : array.split(',')

/** Methods */
// @desc    Portfolio V4 User Profile (Get A User)
// @route   POST /api/v1/users/private/profile/resume/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserResume = async(req, res, next) => {
  try {
    // get edus, jobs, projects, techs, resumes, users data from redis
    let redisAllData = await getAllData()
    let edus = redisAllData.edus
    let jobs = redisAllData.jobs
    let projects = redisAllData.projects
    let resumes = redisAllData.resumes
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(200).json({
      success: false,
      error: `Failed to get active user's resumes data from Resume Collection`,
      data: {}
    })

    // get populated user (educations)
    let edusPopulated = []
    user.educations.forEach(state => {
      edus.forEach(edu => {
        if(edu._id === state) edusPopulated.push({...edu})
      })
    })
    user.educations = edusPopulated

    // get populated user (jobs)
    let jobsPopulated = []
    user.jobs.forEach(state => {
      jobs.forEach(job => {
        if(job._id === state) jobsPopulated.push({...job})
      })
    })
    user.jobs = jobsPopulated

    // get populated user (projects)
    let projectsPopulated = []
    user.projects.forEach(state => {
      projects.forEach(project => {
        if(project._id === state) projectsPopulated.push({...project})
      })
    })
    user.projects = projectsPopulated

    // get populated user (resumes)
    let resumesPopulated = []
    user.resumes.forEach(state => {
      resumes.forEach(resume => {
        if(resume._id === state) resumesPopulated.push({...resume})
      })
    })
    user.resumes = resumesPopulated

    // get populated users' resumes
    user.resumes.forEach(resume => {
      // edus
      let edusPopulated = []
      resume.educations.forEach(state => {
        edus.forEach(edu => {
          if(edu._id === state) edusPopulated.push({...edu})
        })
      })
      resume.educations = edusPopulated

      // jobs
      let jobsPopulated = []
      resume.jobs.forEach(state => {
        jobs.forEach(job => {
          if(job._id === state) jobsPopulated.push({...job})
        })
      })
      resume.jobs = jobsPopulated

      // projects
      let projectsPopulated = []
      resume.projects.forEach(state => {
        projects.forEach(project => {
          if(project._id === state) projectsPopulated.push({...project})
        })
      })
      resume.projects = projectsPopulated

      // techs
      let techsPopulated = []
      resume.techs.forEach(state => {
        techs.forEach(tech => {
          if(tech._id === state) techsPopulated.push({...tech})
        })
      })
      resume.techs = techsPopulated
    })

    return res.status(200).json({
      success: true,
      count: 1,
      data: {
        _id: user._id,
        resumes: user.resumes,
        projects: user.projects,
        educations: user.educations,
        jobs: user.jobs
      }
    })
  } catch(err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to get resumes from Resume Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's Resume)
// @route   POST /api/v1/users/private/profile/resume/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserResume = async(req, res, next) => {
  let {
    website, title, description, techs, projects, educations, jobs, creator
  } = req.body

  // get resumes, techs, & users data from redis
  let redisAllData = await getAllData()
  let resumes = redisAllData.resumes
  let techsRedis = redisAllData.techs
  let users = redisAllData.users
  
  let techNames = techs.split(',')
  let techIds = await handleGetTechIds(techsRedis, techNames)

  const resume = new Resume({ 
    pdfSrc: req.file.originalname,
    contactInfo: { 
      website: handleNoneInput(website),
      title: handleNoneInput(title) 
    },
    description: handleNoneInput(description), 
    techs: techIds,
    projects: handleEmptyArray(projects), 
    educations: handleEmptyArray(educations),
    jobs: handleEmptyArray(jobs),
    creator: creator 
  })
  // console.log(resume)
  resume.save()
  .then(async data => {
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { resumes: data._id } },
    )

    /** update resumes & users redis */
    // add new added data to resumes redis
    resumes.push(data)
    // set new resumes redis
    await setAllResume(resumes)
    // add & update new resume id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.resumes.push(data._id)
    })
    // set new users redis
    await setAllUser(users)

    let resume = await data.populate('techs').populate('projects').populate('educations').populate('jobs').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: resume.length,
      data: resume
    })
  })
  .catch(err => { console.log(err)
    res.status(200).json({
      success: false,
      error: `Failed to add new resume data from Resume Collection`,
      data: err
    })

    // - remove image from server images folder
    handlePdfRemove(res, req.file.originalname)
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Resume)
// @route   POST /api/v1/users/private/profile/resume/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserResume = async(req, res, next) => {
  let {
    resumeId, resume
  } = req.body
  
  // get resumes, techs data from redis
  let redisAllData = await getAllData()
  let resumes = redisAllData.resumes
  let techsRedis = redisAllData.techs

  let techIds = await handleGetTechIds(techsRedis, resume.techs)

  await Resume.findByIdAndUpdate(
    { _id: resumeId },
    { $set: {
      contactInfo: { 
        website: handleNoneInput(resume.website),
        title: handleNoneInput(resume.title) 
      },
      description: handleNoneInput(resume.description),
      techs: techIds,
      projects: resume.projects,
      educations: resume.educations,
      jobs: resume.jobs
    } },
    { new: true }
  )
  .then(async data => {
    /** update resumes redis */
    // update resume info
    resumes.forEach(state => {
      if(state._id === resumeId) {
        state.contactInfo.website = handleNoneInput(resume.website)
        state.contactInfo.title = handleNoneInput(resume.title)
        state.description = handleNoneInput(resume.description)
        state.techs = techIds
        state.projects = resume.projects
        state.educations = resume.educations
        state.jobs = resume.jobs
      }
    })
    // set new resumes redis
    await setAllResume(resumes)

    let resumePopulated = await data.populate('techs').populate('projects').populate('educations').populate('jobs').execPopulate()

    return res.status(200).json({
      success: true,
      count: resumePopulated.length,
      data: resumePopulated
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update resume from Resume Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Resume Pdf)
// @route   POST /api/v1/users/private/profile/resume/update/pdf
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserResumePdf = async(req, res, next) => {
  let { resumeId, pdfSrc } = req.body

  // - remove image from server images folder
  handlePdfRemove(res, pdfSrc)

  // get resumes, techs data from redis
  let redisAllData = await getAllData()
  let resumes = redisAllData.resumes

  await Resume.findByIdAndUpdate(
    { _id: resumeId },
    { $set: { pdfSrc: req.file.originalname } },
    { new: true }
  )
  .then(async data => {
    /** update resumes redis */
    // update resume info
    resumes.forEach(state => {
      if(state._id === resumeId) state.pdfSrc = req.file.originalname
    })
    // set new resumes redis
    await setAllResume(resumes)

    let resume = await data.populate('techs').populate('projects').populate('educations').populate('jobs').execPopulate()

    return res.status(200).json({
      success: true,
      count: resume.length,
      data: resume
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update resume pdf from Resume Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Resume Publish)
// @route   POST /api/v1/users/private/profile/resume/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserResumePublish = async(req, res, next) => {
  let { resumeId, intention } = req.body

  // get resumes, techs data from redis
  let redisAllData = await getAllData()
  let resumes = redisAllData.resumes
  
  try {
    // check if other resume is published
    let resumeActive = resumes.find(resume => resume.status === 1)
    if(resumeActive) {
      if(resumeActive._id.toString() !== resumeId) return res.status(200).json({
        success: false,
        error: `Resume ${resumeActive.contactInfo.website} still ACTIVE! Please deactivate the resume first.`,
        data: {}
      })
    } 

    let data = await Resume.findByIdAndUpdate(
      { _id: resumeId },
      { $set: {
        status: (() => intention === 'publish' ? 1 : 0)()
      } },
      { new: true }
    )

    /** update resumes redis */
    // update resume info
    resumes.forEach(state => {
      if(state._id === resumeId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new resumes redis
    await setAllResume(resumes)
    
    let resume = await data.populate('techs').populate('projects').populate('educations').populate('jobs').execPopulate()

    return res.status(200).json({
      success: true,
      count: resume.length,
      data: resume
    })
  } catch(err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to update resume publish from Resume Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Delete A User's Resume)
// @route   POST /api/v1/users/private/profile/resume/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserResume = async(req, res, next) => {
  try{
    // get resumes & users data from redis
    let redisAllData = await getAllData()
    let resumes = redisAllData.resumes
    let users = redisAllData.users

    // check if resume if ACTIVE
    let resumeActive = resumes.find(resume => resume.status === 1)
    if(resumeActive) {
      if(resumeActive._id.toString() === req.body.resumeId) return res.status(200).json({
        success: false,
        error: `Please Deactivate the resume first before removing/deleting them.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { resumes: req.body.resumeId } },
    )

    let resumeDeleted = resumes.find(resume => resume._id === req.body.resumeId)
    
    // - remove pdf from server files folder
    handlePdfRemove(res, resumeDeleted.pdfSrc)

    // delete resume
    await Resume.deleteOne({ _id: req.body.resumeId })

    /** update resumes redis */
    // delete resume
    let filtered = resumes.filter(state => state._id !== req.body.resumeId)
    // set new resumes redis
    await setAllResume(filtered)
    // remove deleted resume from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.resumes.filter(state => state !== req.body.resumeId)
        user.resumes = filtered
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
      error: `Failed to delete resume data from Resume Collection`,
      data: err
    })
  }
}