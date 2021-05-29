/** Dependencies */
// Model - User
const {
  About, 
  Contact, 
  Home, 
  Job,
  Likestatus, 
  Mail, 
  Media, 
  Post, 
  Project, 
  Skill, 
  Socialmedia, 
  Technology, 
  User,
} = require('../models')
// Controllers
const {
  // Redis Promises
  getDefaultAllData, resetDefaultAllData
} = require('../controllers')

/** Page Specific Functions */
// handle update like status
const handleUpdateLikeStatus = (likes, likesObjArray, intention) => {
  let updateLikesObjs = []
  likes.forEach(state => {
    let selectedArrayObj = intention === 'post' ? state.likedPosts : state.likedProjects
    selectedArrayObj.forEach(liked => {
      let objCount = 0
      let objId = intention === 'post' ? liked.postId : liked.projectId
      likesObjArray.forEach(obj => {
        if(obj._id === objId) {
          if(liked.status === true) objCount = 1
          else  objCount = -1
        }
      })
      updateLikesObjs.push({ _id: objId, count: objCount })
    })
  })
  // console.log(updateLikesObjs)
  let getTotalCount = ({ _id }, data) => {
    let filtered = data.filter(d => d._id === _id)
    let totalCount = 0
    filtered.forEach(d => totalCount = totalCount + d.count)
    return totalCount
  }
  let grouped = updateLikesObjs.reduce((group, obj, i , likes) => {
    let alreadyBeenGrouped = group.some(({ _id }) => _id === obj._id)

    if(!alreadyBeenGrouped) {
      group.push({
        _id: obj._id,
        count: getTotalCount(obj, likes)
      })
    }

    return group
  }, [])
  // console.log(grouped)
  return grouped
}

/** Methods */
// @desc    Portfolio V4 Dashboard (Get All Counts)
// @route   POST /api/v1/dashboard
// @access  Private (Require sessionId & uid)
exports.getPrivateDashboard = async(req, res, next) => {
  try {
    const redisAllData = await getDefaultAllData()
    
    // get ACTIVE user
    // let user = await User.aggregate([
    //   {$match: { status: 1 }}, 
    //   { $project: { 
    //     homes: { $size: '$homes' },
    //     abouts: { $size: '$abouts' },
    //     socialMedias: { $size: '$socialMedias' },
    //     educations: { $size: '$educations' },
    //     jobs: { $size: '$jobs' },
    //     skills: { $size: '$skills' },
    //     projects: { $size: '$projects' },
    //     posts: { $size: '$posts' }, 
    //   } }
    // ])
    // // - throw an error if user not found
    // if(!user) return res.status(400).json({
    //   success: false,
    //   error: `Failed to get active user data from User Collection`,
    //   data: {}
    // }); console.log(user[0])
    
    return res.status(200).json({
      success: true,
      count: user.length,
      // count: 1,
      data: {
        user: {
          _id: user[0]._id,
          abouts: user[0].abouts,
          edus: user[0].educations,
          homes: user[0].homes,
          jobs: user[0].jobs,
          mails: (() => {
            let filtered = redisAllData.contactsRedis.find(state => state.creator === user[0]._id.toString())
            return filtered.mails.length
          })(),
          medias: (() => {
            let filtered = redisAllData.mediasRedis.filter(state => state.creator === user[0]._id.toString())
            return filtered.length
          })(),
          posts: user[0].posts,
          projects: user[0].projects,
          skills: user[0].skills,
          socialMedias: user[0].socialMedias,
          subscriptions: (() => {
            let filtered = redisAllData.subscriptionsRedis.filter(sub => sub.subsTo === req.session.userId)
            return filtered.length
          })(),
          techs: (() => {
            let filtered = redisAllData.techsRedis.filter(state => state.creator === user[0]._id.toString())
            return filtered.length
          })()
        },
        // user: {
        //   _id: 10,
        //   abouts: 10,
        //   edus: 10,
        //   homes: 10,
        //   jobs: 10,
        //   mails: 10,
        //   medias: 10,
        //   posts: 10,
        //   projects: 10,
        //   skills: 10,
        //   socialMedias: 10,
        //   techs: 10
        // },
        total: {
          aboutsCount: redisAllData.aboutsRedis.length,
          edusCount: redisAllData.educationsRedis.length,
          homesCount: redisAllData.homesRedis.length,
          jobsCount: redisAllData.jobsRedis.length,
          mailsCount: redisAllData.mailsRedis.length,
          mediasCount: redisAllData.mediasRedis.length,
          postsCount: redisAllData.postsRedis.length,
          projectsCount: redisAllData.projectsRedis.length,
          skillsCount: redisAllData.skillsRedis.length,
          socialMediasCount: redisAllData.socialMediasRedis.length,
          subscriptionsCount: redisAllData.subscriptionsRedis.length,
          techsCount: redisAllData.techsRedis.length,
          usersCount: redisAllData.usersRedis.length
        }
      }
    })
  } catch(err) { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to get data from Database`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Dashboard (Reset All Redis Data)
// @route   POST /api/v1/dashboard/resetredis
// @access  Private (Require sessionId & uid)
exports.updatePrivateDashboardRedisAllData = async(req, res, next) => {
  try {
    const redisAllData = await getDefaultAllData()

    // update likes for posts & projects
    // let likes = [
    //   { 
    //     ipv4: '111', 
    //     likedPosts: [
    //       { postId: '1p', status: true },
    //       { postId: '3p', status: true },
    //     ] 
    //   },
    //   { 
    //     ipv4: '222', 
    //     likedPosts: [
    //       { postId: '2p', status: true },
    //       { postId: '3p', status: true },
    //     ] 
    //   },
    //   { 
    //     ipv4: '333', 
    //     likedPosts: [
    //       { postId: '2p', status: true },
    //       { postId: '3p', status: true },
    //     ] 
    //   }
    // ]
    // let posts = [
    //   { _id: '1p', like: 0 },
    //   { _id: '2p', like: 0 },
    //   { _id: '3p', like: 0 },
    //   { _id: '4p', like: 0 },
    //   { _id: '5p', like: 0 },
    // ]
    
    let likedPosts = handleUpdateLikeStatus(redisAllData.likeStatusesTempRedis, redisAllData.postsRedis, 'post')
    let likedProjects = handleUpdateLikeStatus(redisAllData.likeStatusesTempRedis, redisAllData.projectsRedis, 'project')

    // get just ids
    let likedPostIds = []
    likedPosts.forEach(state => likedPostIds.push(state._id))
    let likedProjectIds = []
    likedProjects.forEach(state => likedProjectIds.push(state._id)) 

    // if(redisAllData.likeStatusesTempRedis.length > 0) {
    //   // update to Collection (Likestatus)
    //   redisAllData.likeStatusesTempRedis.forEach(temp => { 
    //     let trackedUserExist = false
    //     redisAllData.likeStatusesRedis.forEach(current => {
    //       if(current.ipv4 === temp.ipv4) {
    //         trackedUserExist = true
    //         current.likedPosts.forEach(currLikedPost => {
    //           temp.likedPosts.forEach(tempLikedPost => {
    //             if(currLikedPost.postId === tempLikedPost.postId) {
    //               currLikedPost.status = tempLikedPost.status
    //             }
    //           })
    //         })
    //       }
    //     })
    //     if(trackedUserExist === false) redis
    //   })

      // update to Collection (Post & Project)
      likedPosts.forEach(async newData => {
        await Post.updateOne(
          { _id: newData._id },
          { $set: {
            like: (() => {
              // get current post like
              let currentPost = redisAllData.postsRedis.find(state => state._id === newData._id)
              let newCount = +currentPost.like + +newData.count
              return newCount > 0 ? newCount : 0
            })()
          } }
        )
      })
      likedProjects.forEach(async newData => {
        await Project.updateOne(
          { _id: newData._id },
          { $set: {
            like: (() => {
              // get current project like
              let currentProject = redisAllData.projectsRedis.find(state => state._id === newData._id)
              let newCount = +currentProject.like + +newData.count
              return newCount > 0 ? newCount : 0
            })()
          } }
        )
      })
    // }

    // reset all available data to redis
    await resetDefaultAllData()

    // get ACTIVE user
    let user = await User.aggregate([
      {$match: { status: 1 }}, 
      { $project: { 
        homes: { $size: '$homes' },
        abouts: { $size: '$abouts' },
        socialMedias: { $size: '$socialMedias' },
        educations: { $size: '$educations' },
        jobs: { $size: '$jobs' },
        skills: { $size: '$skills' },
        projects: { $size: '$projects' },
        posts: { $size: '$posts' }, 
      } }
    ])
    // - throw an error if user not found
    if(!user) return res.status(400).json({
      success: false,
      error: `Failed to get active user data from User Collection`,
      data: {}
    })

    return res.status(200).json({
      success: true,
      count: user.length,
      data: {
        user: {
          _id: user[0]._id,
          abouts: user[0].abouts,
          edus: user[0].educations,
          homes: user[0].homes,
          jobs: user[0].jobs,
          mails: (() => {
            let filtered = redisAllData.contactsRedis.find(state => state.creator === user[0]._id.toString())
            return filtered.mails.length
          })(),
          medias: (() => {
            let filtered = redisAllData.mediasRedis.filter(state => state.creator === user[0]._id.toString())
            return filtered.length
          })(),
          posts: user[0].posts,
          projects: user[0].projects,
          skills: user[0].skills,
          socialMedias: user[0].socialMedias,
          subscriptions: (() => {
            let filtered = redisAllData.subscriptionsRedis.filter(sub => sub.subsTo === req.session.userId)
            return filtered.length
          })(),
          techs: (() => {
            let filtered = redisAllData.techsRedis.filter(state => state.creator === user[0]._id.toString())
            return filtered.length
          })()
        },
        total: {
          aboutsCount: redisAllData.aboutsRedis.length,
          edusCount: redisAllData.educationsRedis.length,
          homesCount: redisAllData.homesRedis.length,
          jobsCount: redisAllData.jobsRedis.length,
          mailsCount: redisAllData.mailsRedis.length,
          mediasCount: redisAllData.mediasRedis.length,
          postsCount: redisAllData.postsRedis.length,
          projectsCount: redisAllData.projectsRedis.length,
          skillsCount: redisAllData.skillsRedis.length,
          socialMediasCount: redisAllData.socialMediasRedis.length,
          subscriptionsCount: redisAllData.subscriptionsRedis.length,
          techsCount: redisAllData.techsRedis.length,
          usersCount: redisAllData.usersRedis.length
        }
      }
    })
  } catch(err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to reset redis data. Please try again later.`,
      data: err
    })
  }
}