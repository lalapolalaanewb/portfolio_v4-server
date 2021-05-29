/** Dependencies */
// Redis Promises
const { getAsync, setAsync } = require('./redis-promises')
// Model
const {
  About,
  Comment,
  Contact,
  Education,
  Home,
  Job,
  Likestatus,
  Mail,
  Media,
  Mediasocial,
  Policy,
  Post,
  Project,
  Resume,
  Skill,
  Socialmedia,
  Subscription,  
  Technology,
  User,
} = require('../models')

/** Data SET Handler */
// Set all data upon login success (use in auth.js)
async function setDefaultAllData() {
  /** set about all redis */
  // get all about
  const aboutsDB = await About.find().select('-__v')
  // check if about all redis exist
  const aboutsRedisExist = await getAsync(`pfv4_abouts`)
  if(!aboutsRedisExist) await setAsync(`pfv4_abouts`, JSON.stringify(aboutsDB))

  /** set contact all redis */
  // get all contact
  const contactsDB = await Contact.find().select('-__v')
  // check if contact all redis exist
  const contactsRedisExist = await getAsync(`pfv4_contacts`)
  if(!contactsRedisExist) await setAsync(`pfv4_contacts`, JSON.stringify(contactsDB))

  /** set education all redis */
  // get all education
  const educationsDB = await Education.find().select('-__v')
  // check if education all redis exist
  const educationsRedisExist = await getAsync(`pfv4_educations`)
  if(!educationsRedisExist) await setAsync(`pfv4_educations`, JSON.stringify(educationsDB))

  /** set home all redis */
  // get all home
  const homesDB = await Home.find().select('-__v')
  // check if home all redis exist
  const homesRedisExist = await getAsync(`pfv4_homes`)
  if(!homesRedisExist) await setAsync(`pfv4_homes`, JSON.stringify(homesDB))

  /** set job all redis */
  // get all job
  const jobsDB = await Job.find().select('-__v')
  // check if job all redis exist
  const jobsRedisExist = await getAsync(`pfv4_jobs`)
  if(!jobsRedisExist) await setAsync(`pfv4_jobs`, JSON.stringify(jobsDB))

  /** set likeStatus all redis */
  // get all likeStatus
  const likeStatusesDB = await Likestatus.find().select('-__v')
  // check if likeStatus all redis exist
  const likeStatusesRedisExist = await getAsync(`pfv4_likeStatuses`)
  if(!likeStatusesRedisExist) await setAsync(`pfv4_likeStatuses`, JSON.stringify(likeStatusesDB))

  /** set likeStatus all redis */
  // get all likeStatus
  const likeStatusesTempDB = []
  // check if likeStatus all redis exist
  const likeStatusesTempRedisExist = await getAsync(`pfv4_likeStatusesTemp`)
  if(!likeStatusesTempRedisExist) await setAsync(`pfv4_likeStatusesTemp`, JSON.stringify(likeStatusesTempDB))

  /** set mail all redis */
  // get all mail
  const mailsDB = await Mail.find().select('-__v')
  // check if mail all redis exist
  const mailsRedisExist = await getAsync(`pfv4_mails`)
  if(!mailsRedisExist) await setAsync(`pfv4_mails`, JSON.stringify(mailsDB))

  /** set media all redis */
  // get all media
  const mediasDB = await Media.find().select('-__v')
  // check if media all redis exist
  const mediasRedisExist = await getAsync(`pfv4_medias`)
  if(!mediasRedisExist) await setAsync(`pfv4_medias`, JSON.stringify(mediasDB))

  /** set mediaSocial all redis */
  // get all mediaSocial
  const mediaSocialsDB = await Mediasocial.find().select('-__v')
  // check if mediaSocial all redis exist
  const mediaSocialsRedisExist = await getAsync(`pfv4_mediaSocials`)
  if(!mediaSocialsRedisExist) await setAsync(`pfv4_mediaSocials`, JSON.stringify(mediaSocialsDB))

  /** set policy all redis */
  // get all policy
  const policiesDB = await Policy.find().select('-__v')
  // check if policy all redis exist
  const policiesRedisExist = await getAsync(`pfv4_policies`)
  if(!policiesRedisExist) await setAsync(`pfv4_policies`, JSON.stringify(policiesDB))

  /** set post all redis */
  // get all post
  const postsDB = await Post.find().select('-__v')
  // check if post all redis exist
  const postsRedisExist = await getAsync(`pfv4_posts`)
  if(!postsRedisExist) await setAsync(`pfv4_posts`, JSON.stringify(postsDB))

  /** set project all redis */
  // get all project
  const projectsDB = await Project.find().select('-__v')
  // check if project all redis exist
  const projectsRedisExist = await getAsync(`pfv4_projects`)
  if(!projectsRedisExist) await setAsync(`pfv4_projects`, JSON.stringify(projectsDB))

  /** set resume all redis */
  // get all resume
  const resumesDB = await Resume.find().select('-__v')
  // check if resume all redis exist
  const resumesRedisExist = await getAsync(`pfv4_resumes`)
  if(!resumesRedisExist) await setAsync(`pfv4_resumes`, JSON.stringify(resumesDB))

  /** set skill all redis */
  // get all skill
  const skillsDB = await Skill.find().select('-__v')
  // check if skill all redis exist
  const skillsRedisExist = await getAsync(`pfv4_skills`)
  if(!skillsRedisExist) await setAsync(`pfv4_skills`, JSON.stringify(skillsDB))

  /** set socialMedia all redis */
  // get all socialMedia
  const socialMediasDB = await Socialmedia.find().select('-__v')
  // check if socialMedia all redis exist
  const socialMediasRedisExist = await getAsync(`pfv4_socialMedias`)
  if(!socialMediasRedisExist) await setAsync(`pfv4_socialMedias`, JSON.stringify(socialMediasDB))

  /** set subscription all redis */
  // get all subscription
  const subscriptionsDB = await Subscription.find().select('-__v')
  // check if subscription all redis exist
  const subscriptionsRedisExist = await getAsync(`pfv4_subscriptions`)
  if(!subscriptionsRedisExist) await setAsync(`pfv4_subscriptions`, JSON.stringify(subscriptionsDB))

  /** set tech all redis */
  // get all tech
  const techsDB = await Technology.find().select('-__v')
  // check if tech all redis exist
  const techsRedisExist = await getAsync(`pfv4_techs`)
  if(!techsRedisExist) await setAsync(`pfv4_techs`, JSON.stringify(techsDB))

  /** set user all redis */
  // get all user
  const usersDB = await User.find().select('-__v')
  // check if user all redis exist
  const usersRedisExist = await getAsync(`pfv4_users`)
  if(!usersRedisExist) await setAsync(`pfv4_users`, JSON.stringify(usersDB))
}

// Get all data
async function getDefaultAllData() {
  // get abouts
  const aboutsRedis = JSON.parse(await getAsync(`pfv4_abouts`))
  // get contacts
  const contactsRedis = JSON.parse(await getAsync(`pfv4_contacts`))
  // get educations
  const educationsRedis = JSON.parse(await getAsync(`pfv4_educations`))
  // get homes
  const homesRedis = JSON.parse(await getAsync(`pfv4_homes`))
  // get jobs
  const jobsRedis = JSON.parse(await getAsync(`pfv4_jobs`))
  // get likeStatus
  const likeStatusesRedis = JSON.parse(await getAsync(`pfv4_likeStatuses`))
  // get likeStatusTemp
  const likeStatusesTempRedis = JSON.parse(await getAsync(`pfv4_likeStatusesTemp`))
  // get mails
  const mailsRedis = JSON.parse(await getAsync(`pfv4_mails`))
  // get medias
  const mediasRedis = JSON.parse(await getAsync(`pfv4_medias`))
  // get mediaSocials
  const mediaSocialsRedis = JSON.parse(await getAsync(`pfv4_mediaSocials`))
  // get policies
  const policiesRedis = JSON.parse(await getAsync(`pfv4_policies`))
  // get posts
  const postsRedis = JSON.parse(await getAsync(`pfv4_posts`))
  // get projects
  const projectsRedis = JSON.parse(await getAsync(`pfv4_projects`))
  // get resumes
  const resumesRedis = JSON.parse(await getAsync(`pfv4_resumes`))
  // get skills
  const skillsRedis = JSON.parse(await getAsync(`pfv4_skills`))
  // get socialMedias
  const socialMediasRedis = JSON.parse(await getAsync(`pfv4_socialMedias`))
  // get subscriptions
  const subscriptionsRedis = JSON.parse(await getAsync(`pfv4_subscriptions`))
  // get techs
  const techsRedis = JSON.parse(await getAsync(`pfv4_techs`))
  // get users
  const usersRedis = JSON.parse(await getAsync(`pfv4_users`))

  return {
    aboutsRedis,
    contactsRedis,
    educationsRedis,
    homesRedis,
    jobsRedis,
    likeStatusesRedis,
    likeStatusesTempRedis,
    mailsRedis,
    mediasRedis,
    mediaSocialsRedis,
    policiesRedis,
    postsRedis,
    projectsRedis,
    resumesRedis,
    skillsRedis,
    socialMediasRedis,
    subscriptionsRedis,
    techsRedis,
    usersRedis
  }
}

// Reset all data upon login success (use in dashboard.js)
async function resetDefaultAllData() {
  /** set about all redis */
  // get all about
  const aboutsDB = await About.find().select('-__v')
  await setAsync(`pfv4_abouts`, JSON.stringify(aboutsDB))

  /** set contact all redis */
  // get all contact
  const contactsDB = await Contact.find().select('-__v')
  await setAsync(`pfv4_contacts`, JSON.stringify(contactsDB))

  /** set education all redis */
  // get all education
  const educationsDB = await Education.find().select('-__v')
  await setAsync(`pfv4_educations`, JSON.stringify(educationsDB))

  /** set home all redis */
  // get all home
  const homesDB = await Home.find().select('-__v')
  await setAsync(`pfv4_homes`, JSON.stringify(homesDB))

  /** set job all redis */
  // get all job
  const jobsDB = await Job.find().select('-__v')
  await setAsync(`pfv4_jobs`, JSON.stringify(jobsDB))

  /** set likeStatus all redis */
  // get all likeStatus
  const likeStatusesDB = await Likestatus.find().select('-__v')
  await setAsync(`pfv4_likeStatuses`, JSON.stringify(likeStatusesDB))

  /** set likeStatus all redis */
  // get all likeStatus
  const likeStatusesTempDB = []
  await setAsync(`pfv4_likeStatusesTemp`, JSON.stringify(likeStatusesTempDB))

  /** set mail all redis */
  // get all mail
  const mailsDB = await Mail.find().select('-__v')
  await setAsync(`pfv4_mails`, JSON.stringify(mailsDB))

  /** set media all redis */
  // get all media
  const mediasDB = await Media.find().select('-__v')
  await setAsync(`pfv4_medias`, JSON.stringify(mediasDB))

  /** set mediaSocial all redis */
  // get all mediaSocial
  const mediaSocialsDB = await Mediasocial.find().select('-__v')
  await setAsync(`pfv4_mediaSocials`, JSON.stringify(mediaSocialsDB))

  /** set policy all redis */
  // get all policy
  const policiesDB = await Policy.find().select('-__v')
  await setAsync(`pfv4_policies`, JSON.stringify(policiesDB))

  /** set post all redis */
  // get all post
  const postsDB = await Post.find().select('-__v')
  await setAsync(`pfv4_posts`, JSON.stringify(postsDB))

  /** set project all redis */
  // get all project
  const projectsDB = await Project.find().select('-__v')
  await setAsync(`pfv4_projects`, JSON.stringify(projectsDB))

  /** set resume all redis */
  // get all resume
  const resumesDB = await Resume.find().select('-__v')
  await setAsync(`pfv4_resumes`, JSON.stringify(resumesDB))

  /** set skill all redis */
  // get all skill
  const skillsDB = await Skill.find().select('-__v')
  await setAsync(`pfv4_skills`, JSON.stringify(skillsDB))

  /** set socialMedia all redis */
  // get all socialMedia
  const socialMediasDB = await Socialmedia.find().select('-__v')
  await setAsync(`pfv4_socialMedias`, JSON.stringify(socialMediasDB))

  /** set subscription all redis */
  // get all subscription
  const subscriptionsDB = await Subscription.find().select('-__v')
  await setAsync(`pfv4_subscriptions`, JSON.stringify(subscriptionsDB))

  /** set tech all redis */
  // get all tech
  const techsDB = await Technology.find().select('-__v')
  await setAsync(`pfv4_techs`, JSON.stringify(techsDB))

  /** set user all redis */
  // get all user
  const usersDB = await User.find().select('-__v')
  await setAsync(`pfv4_users`, JSON.stringify(usersDB))
}

/** Export */
module.exports = {
  getDefaultAllData, 
  setDefaultAllData,
  resetDefaultAllData
}