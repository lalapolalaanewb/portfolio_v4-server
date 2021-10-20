/** Dependencies */
// Bcrypt
const bcrypt = require('bcryptjs')
// Model - User
const {
 Media, Mediasocial, Policy,  Resume, Skill, Socialmedia, Technology, User
} = require('../models')
// Controllers
const {
  // Redis Data
  getDefaultAllData,
  // Redis Promises
  setAsync
} = require('../controllers')
const path = require('path')

/** Page Specific Functions */
// get all required data from redis
const getAllData = async() => {
  const redisAllData = await getDefaultAllData()
  return {
    abouts: redisAllData.aboutsRedis,
    edus: redisAllData.educationsRedis,
    homes: redisAllData.homesRedis,
    jobs: redisAllData.jobsRedis,
    medias: redisAllData.mediasRedis,
    mediaSocials: redisAllData.mediaSocialsRedis,
    policies: redisAllData.policiesRedis,
    projects: redisAllData.projectsRedis,
    resumes: redisAllData.resumesRedis,
    skills: redisAllData.skillsRedis,
    socialMedias: redisAllData.socialMediasRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
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
// handle email 'regex'
const handleEmailRegex = email => {
  const emailRegex = /^.+@[^\.].*\.[a-z]{2,}$/

  return emailRegex.test(email.trim())
}

/** Methods */

// @desc    Portfolio V4 Footer Public (Get A User)
// @route   POST /api/v1/users/getfooterpublic
// @access  Public (Only need Admin Public Access Key)
exports.getPublicUserFooterPublic = async(req, res, next) => {
  try {
    // get mediaSocials, socialMedias & users data from redis
    let redisAllData = await getAllData()
    let mediaSocials = redisAllData.mediaSocials
    let socialMedias = redisAllData.socialMedias
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(200).json({
      success: false,
      error: `No active user found. Please refresh the page or try again later.`,
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
      data: {
        _id: user._id,
        socialMedias: user.socialMedias
      }
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get public user footer from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Home Page (Get A User)
// @route   POST /api/v1/users/gethome
// @access  Public (Only need Admin Public Access Key)
exports.getPublicUserHome = async(req, res, next) => {
  try {
    console.log(path.resolve(__dirname + '/', '../../'))
    console.log(path.resolve(__dirname + '/', '../../') + '/portfolio_v4-next_redux/public/images/')
    console.log(path.resolve(__dirname + '/', '../../') + '/portfolio_v4-next_redux/public/files/')
    // set all available data to redis
    // await setDefaultAllData()

    // get homes & users data from redis
    let redisAllData = await getAllData()
    let homes = redisAllData.homes
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(200).json({
      success: false,
      error: `No active user found. Please refresh the page or try again later.`,
      data: {}
    })

    // get populated user (homes)
    let homesPopulated = []
    user.homes.forEach(state => {
    homes.forEach(home => {
        if(home._id === state) homesPopulated.push({...home})
      })
    })
    user.homes = homesPopulated
    
    return res.status(200).json({
      success: true,
      count: 1,
      data: {
        _id: user._id,
        homes: user.homes
      }
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get public user home from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 About Page (Get A User)
// @route   POST /api/v1/users/getabout
// @access  Public (Only need Admin Public Access Key)
exports.getPublicUserAbout = async(req, res, next) => {
  try {
    // get abouts, jobs, skills, techs, & users data from redis
    let redisAllData = await getAllData()
    let abouts = redisAllData.abouts
    let jobs = redisAllData.jobs
    let skills = redisAllData.skills
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get active user
    let user = users.find(user => user.status === 1)
    if(!user) return res.status(200).json({
      success: false,
      error: `No active user found. Please refresh the page or try again later.`,
      data: {}
    })

    // get populated user (abouts)
    let aboutsPopulated = []
    user.abouts.forEach(state => {
      abouts.forEach(about => {
        if(about._id === state) aboutsPopulated.push({...about})
      })
    })
    user.abouts = aboutsPopulated

    // get populated user (jobs)
    let jobsPopulated = []
    user.jobs.forEach(state => {
      jobs.forEach(job => {
        if(job._id === state) jobsPopulated.push({...job})
      })
    })
    user.jobs = jobsPopulated

    // get populated user (skills)
    let skillsPopulated = []
    user.skills.forEach(state => {
      skills.forEach(skill => {
        if(skill._id === state) skillsPopulated.push({...skill})
      })
    })
    user.skills = skillsPopulated

    // get populated user's skills (techs)
    user.skills.forEach(skill => {
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
      count: 1,
      data: {
        _id: user._id,
        name: user.name,
        abouts: user.abouts,
        jobs: user.jobs,
        skills: user.skills
      }
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get public user about from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Resume Page (Get A User)
// @route   POST /api/v1/users/getresume
// @access  Public (Only need Admin Public Access Key)
exports.getPublicUserResume = async(req, res, next) => {
  try {
    // get edus, jobs, projects, techs, & users data from redis
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
      error: `No active user found. Please refresh the page or try again later.`,
      data: {}
    })

    // get active user resume
    let resumesPopulated = resumes.find(resume => resume.creator === user._id)

    // get populated user's resumes (edus)
    let edusPopulated = []
    resumesPopulated.educations.forEach(state => {
      edus.forEach(edu => {
        if(edu._id === state) edusPopulated.push({...edu})
      })
    })
    resumesPopulated.educations = edusPopulated

    // get populated user's resumes (jobs)
    let jobsPopulated = []
    resumesPopulated.jobs.forEach(state => {
      jobs.forEach(job => {
        if(job._id === state) jobsPopulated.push({...job})
      })
    })
    resumesPopulated.jobs = jobsPopulated

    // get populated user's resumes (projects)
    let projectsPopulated = []
    resumesPopulated.projects.forEach(state => {
      projects.forEach(project => {
        if(project._id === state) projectsPopulated.push({...project})
      })
    })
    resumesPopulated.projects = projectsPopulated

    // get populated user's resumes (techs)
    let techsPopulated = []
    resumesPopulated.techs.forEach(state => {
      techs.forEach(tech => {
        if(tech._id === state) techsPopulated.push({...tech})
      })
    })
    resumesPopulated.techs = techsPopulated

    return res.status(200).json({
      success: true,
      count: 1,
      data: {
        _id: user._id,
        name: user.name,
        email: user.credentials.emails.main,
        resume: resumesPopulated
      }
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get public user resume from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Dashboard (Get All Users)
// @route   POST /api/v1/users/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUsers = async(req, res, next) => {
  try {
    // users data from redis
    let redisAllData = await getAllData()
    let users = redisAllData.users

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.sort((a, b) => a.name.firstName < b.name.firstName ? -1 : 1)
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get users from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Dashboard (Add A User)
// @route   POST /api/v1/users/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateUser = async(req, res, next) => {
  let {
    name, credentials
  } = req.body 

  // users data from redis
  let redisAllData = await getAllData()
  let users = redisAllData.users
  
  if(credentials.emails.main !== 'none') {
    // check if user already exist
    const userExist = users.find(user => user.credentials.emails.main === credentials.emails.main)
    if(userExist) return res.status(200).json({
      success: false,
      error: `User already exists.`,
      data: {}
    })

    // check if email (main) regex correct
    if(!handleEmailRegex(credentials.emails.main)) return res.status(200).json({
      success: false,
      error: `Invalid email main!`,
      data: {}
    })
  }

  if(credentials.emails.backup !== 'none') {
    // check if email (backup) regex correct
    if(!handleEmailRegex(credentials.emails.backup)) return res.status(200).json({
      success: false,
      error: `Invalid email backup!`,
      data: {}
    })
  }

  // check if password match
  if(credentials.password !== credentials.passwordConfirm) return res.status(200).json({
    success: false,
    error: `Password not match!`,
    data: {}
  })

  // hashed password
  const passwordHashed = await bcrypt.hash(credentials.password, await bcrypt.genSalt(12))
  
  // create new user
  const newUser = new User({
    name: {
      firstName: handleNoneInput(name.firstName),
      lastName: handleNoneInput(name.lastName),
      nickName: handleNoneInput(name.nickName)
    },
    credentials: {
      emails: {
        main: handleNoneInput(credentials.emails.main),
        backup: handleNoneInput(credentials.emails.backup)
      },
      password: passwordHashed
    }
  })

  newUser.save()
  .then(async data => {
    /** update users redis */
    // add new added data to user redis
    users.push(data)
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to add new user data to User Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Dashboard (Update A User Activation)
// @route   POST /api/v1/users/private/update/active
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserActive = async(req, res, next) => {
  let { userId, intention } = req.body

  // users data from redis
  let redisAllData = await getAllData()
  let users = redisAllData.users
  
  try {
    // check if other user still active
    let userActive = users.find(user => user.status === 1)
    if(userActive) {
      if(userActive._id.toString() !== userId) return res.status(200).json({
        success: false,
        error: `User (${userActive.name.firstName} ${userActive.name.lastName}) with email (${userActive.credentials.emails.main}) still ACTIVE! Please deactivate the user to continue.`,
        data: {}
      })
    }

    // update user status
    let user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: {
        status: (() => intention === 'activate' ? 1 : 0)()
      } },
      { new: true }
    )
    // throw error if nothing gets in return
    if(!user) return res.status(200).json({
      success: false,
      error: `Error while updating user active status. Please try again later.`,
      data: {}
    })

    /** update users redis */
    // update user info
    users.forEach(state => {
      if(state._id === userId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: user.length,
      data: user
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update user active status from User Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Dashboard (Update A User)
// @route   POST /api/v1/users/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateUser = async(req, res, next) => {
  let {
    name, credentials
  } = req.body

  // users data from redis
  let redisAllData = await getAllData()
  let users = redisAllData.users

  if(credentials.emails.main !== 'none') {
    // check if user already exist
    const userExist = users.find(user => user._id === req.params.id)
    if(!userExist) return res.status(200).json({
      success: false,
      error: `User doesn't exists.`,
      data: {}
    })

    // check if email (main) regex correct
    if(!handleEmailRegex(credentials.emails.main)) return res.status(200).json({
      success: false,
      error: `Invalid email main!`,
      data: {}
    })
  }

  if(credentials.emails.backup !== 'none') {
    // check if email (backup) regex correct
    if(!handleEmailRegex(credentials.emails.backup)) return res.status(200).json({
      success: false,
      error: `Invalid email backup!`,
      data: {}
    })
  }
 
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: {
        firstName: handleNoneInput(name.firstName),
        lastName: handleNoneInput(name.lastName),
        nickName: handleNoneInput(name.nickName)
      },
      'credentials.emails.main': handleNoneInput(credentials.emails.main),
      'credentials.emails.backup': handleNoneInput(credentials.emails.backup)
    } },
    { new: true }
  )
  .then(async data => {
    /** update users redis */
    // update user info
    users.forEach(state => {
      if(state._id === req.params.id) {
        state.name.firstName = handleNoneInput(name.firstName)
        state.name.latName = handleNoneInput(name.lastName)
        state.name.nickName = handleNoneInput(name.nickName)
        state.credentials.emails.main = handleNoneInput(credentials.emails.main)
        state.credentials.emails.backup = handleNoneInput(credentials.emails.backup)
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update user data from User Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Dashboard (Delete A User)
// @route   POST /api/v1/users/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateUser = async(req, res, next) => {
  try {
    // users data from redis
    let redisAllData = await getAllData()
    let mediasRedis = redisAllData.medias
    let mediaSocialsRedis = redisAllData.mediaSocials
    let policiesRedis = redisAllData.policies
    let techsRedis = redisAllData.techs
    let users = redisAllData.users

    let data = users.find(user => user._id === req.params.id)

    // check user data from abouts
    if(data.abouts.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from About Collection first`,
      data: {}
    })

    // check user data from homes
    if(data.homes.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Home Collection first`,
      data: {}
    })

    // check user data from jobs
    if(data.jobs.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Job Collection first`,
      data: {}
    })

    // check user data from media
    let medias = mediasRedis.filter(state => state.creator === req.params.id)
    if(medias.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Media Collection first`,
      data: {}
    })

    // check user data from media socials
    let mediaSocials = mediaSocialsRedis.filter(state => state.creator === req.params.id)
    if(mediaSocials.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Media Social Collection first`,
      data: {}
    })

    // check user data from policies
    let policies = policiesRedis.filter(state => state.creator === req.params.id)
    if(policies.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Policy Collection first`,
      data: {}
    })

    // check user data from posts
    if(data.posts.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Post Collection first`,
      data: {}
    })

    // check user data from projects
    if(data.projects.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Project Collection first`,
      data: {}
    })

    // check user data from socialMedias
    if(data.socialMedias.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Socialmedia Collection first`,
      data: {}
    })

    // check user data from skills
    if(data.skills.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Skill Collection first`,
      data: {}
    })

    // check user data from techs
    let techs = techsRedis.filter(state => state.creator === req.params.id)
    if(techs.length > 0) return res.status(200).json({
      success: false,
      error: `Please delete data from Tech Collection first`,
      data: {}
    })

    // delete user
    await User.deleteOne({ _id: req.params.id })

    /** update users redis */
    // delete user
    let filtered = users.filter(state => state._id !== req.params.id)
    // set new users redis
    await setAllUser(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })

  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to delete user data from User Collection`,
      data: err
    })
  }
}