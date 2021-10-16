/** Dependencies */
// Model - User
const {
  User, Job
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
    jobs: redisAllData.jobsRedis,
    users: redisAllData.usersRedis
  }
}
// set new jobs redis data
const setAllJob = async(redisAllJob) => {
  await setAsync(`pfv4_jobs`, JSON.stringify(redisAllJob))
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
// @route   POST /api/v1/users/private/profile/job/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserJob = async(req, res, next) => {
  try {
    // get users & jobs data from redis
    let redisAllData = await getAllData()
    let jobs = redisAllData.jobs
    let users = redisAllData.users

    // get active user info
    let user = users.find(user => user.status === 1)
    
    // get all user jobs
    let userJobs = jobs.filter(state => user.jobs.includes(state._id))
    if(!userJobs) return res.status(200).json({
      success: false,
      error: `Failed to get user's jobs data from Job Collection`,
      data: {}
    })

    return res.status(200).json({
      success: true,
      count: userJobs.length,
      data: {
        _id: user._id,
        jobs: userJobs.sort((a, b) => a.name < b.name ? -1: 1)
      }
    })
  } catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to get jobs data from Job Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's Job)
// @route   POST /api/v1/users/private/profile/job/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserJob = async(req, res, next) => {
  let {
    name, abbreviation, desc, company, creator
  } = req.body
  
  // get users & jobs data from redis
  let redisAllData = await getAllData()
  let jobs = redisAllData.jobs
  let users = redisAllData.users

  const newJob = new Job({ 
    name: name, 
    abbreviation: handleNoneInput(abbreviation),
    description: handleNoneInput(desc),
    company: handleNoneInput(company), 
    creator: creator 
  })
  
  newJob.save()
  .then(async data => {
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { jobs: data._id } },
    )

    /** update jobs & users redis */
    // add new added data to jobs redis
    jobs.push(data)
    // set new jobs redis
    await setAllJob(jobs)
    // add & update new job id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.jobs.push(data._id)
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
      error: `Failed to add new job data from Job Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Job)
// @route   POST /api/v1/users/private/profile/job/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserJob = async(req, res, next) => {
  let {
    jobId, job
  } = req.body

  // get users & jobs data from redis
  let redisAllData = await getAllData()
  let jobs = redisAllData.jobs

  await Job.findByIdAndUpdate(
    { _id: jobId },
    { $set: {
      name: job.name,
      abbreviation: handleNoneInput(job.abbreviation),
      description: handleNoneInput(job.description),
      company: handleNoneInput(job.company)
    } },
    { new: true }
  )
  .then(async data => {
    /** update jobs redis */
    // update job info
    jobs.forEach(state => {
      if(state._id === jobId) {
        state.name = job.name
        state.abbreviation = handleNoneInput(job.abbreviation)
        state.description = handleNoneInput(job.description)
        state.company = handleNoneInput(job.company)
      }
    })
    // set new jobs redis
    await setAllJob(jobs)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update job from Job Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Job Publish)
// @route   POST /api/v1/users/private/profile/job/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserJobPublish = async(req, res, next) => {
  let { jobId, intention } = req.body
  
  // get jobs data from redis
  let redisAllData = await getAllData()
  let jobs = redisAllData.jobs

  await Job.findByIdAndUpdate(
    { _id: jobId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update jobs redis */
    // update job info
    jobs.forEach(state => {
      if(state._id === jobId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new jobs redis
    await setAllJob(jobs)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update job publish from Job Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Delete A User's Job)
// @route   POST /api/v1/users/private/profile/job/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserJob = async(req, res, next) => {
  try {
    // get users & jobs data from redis
    let redisAllData = await getAllData()
    let jobs = redisAllData.jobs
    let users = redisAllData.users

    // check if job is published first
    let job = jobs.find(state => state._id === req.body.jobId)
    if(job) {
      if(job.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete job! Please unpublished the job first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { jobs: req.body.jobId } },
    )

    // delete job
    await Job.deleteOne({ _id: req.body.jobId })

    /** update jobs redis */
    // delete job
    let filtered = jobs.filter(state => state._id !== req.body.jobId)
    // set new jobs redis
    await setAllJob(filtered)
    // remove deleted job from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.jobs.filter(state => state !== req.body.jobId)
        user.jobs = filtered
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
      error: `Failed to delete job data from Job Collection`,
      data: err
    })
  }
}