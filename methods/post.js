/** Dependencies */
// Model - Project
const {
  Post, Likestatus, User
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
    posts: redisAllData.postsRedis,
    techs: redisAllData.techsRedis,
    users: redisAllData.usersRedis
  }
}
// set new likeStatusesTemp redis data
const setAllLikeStatusTemp = async(redisAllLikeStatusesTemp) => {
  await setAsync(`pfv4_likeStatusesTemp`, JSON.stringify(redisAllLikeStatusesTemp))
} 
// set new posts redis data
const setAllPost = async(redisAllPost) => {
  await setAsync(`pfv4_posts`, JSON.stringify(redisAllPost))
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

// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/posts
// @access  Public (Only need Admin Public Access Key)
exports.getPublicPosts = async(req, res, next) => {
  try { 
    // get posts, techs, users data from redis
    let redisAllData = await getAllData()
    let posts = redisAllData.posts
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get active posts info
    let postsActive = posts.filter(post => post.status === 1)
    // get populated posts (with creator)
    postsActive.forEach(post => {
      users.forEach(user => {
        if(user._id === post.creator) post.creator = {...user}
      })
    })
    // get populated posts (with tech)
    postsActive.forEach(post => {
      techs.forEach(tech => {
        if(tech._id === post.tech) post.tech = {...tech}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: postsActive.length,
      data: postsActive.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    })
  }
  catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get posts data from Posts Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Posts (Get A Post)
// @route   POST /api/v1/posts/public/get
// @access  Public (Only need Admin Public Access Key)
exports.getPublicPost = async(req, res, next) => {
  try {
    // get posts, techs, users data from redis
    let redisAllData = await getAllData()
    let posts = redisAllData.posts
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get selected post info
    let post = posts.find(post => post._id === req.body.postId)
    if(!post) return res.status(200).json({
      success: false,
      error: `Failed to get post data. Please refresh the page or try again later.`,
      data: {}
    })
    // get populated post (with creator)
    users.forEach(user => {
      if(user._id === post.creator) post.creator = {...user}
    })
    // get populated posts (with tech)
    techs.forEach(tech => {
      if(tech._id === post.tech) post.tech = {...tech}
    })
    
    return res.status(200).json({
      success: true,
      count: 1,
      data: post
    })
  }
  catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get post data from Posts Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Posts (Update Post Like)
// @route   POST /api/v1/posts/public/update
// @access  Public (Only need Admin Public Access Key)
exports.updatePublicPost = async(req, res, next) => {
  try {
    let {
      post, user
    } = req.body
    // return console.log(req.body)
    // get likeStatusesTemp, posts, techs, users data from redis
    let redisAllData = await getAllData()
    let likeStatusesTemp = redisAllData.likeStatusesTemp

    // check if user likeStatusesTemp exist
    let likeStatus = likeStatusesTemp.find(state => state.ipv4 === user)
    if(!likeStatus) likeStatusesTemp.push({
      ipv4: user,
      likedProjects: [],
      likedPosts: [{ postId: post._id, status: post.status }]
    }) 
    else {
      likeStatusesTemp.forEach(state => {
        if(state.ipv4 === user) {
          let isLikedExist = false
          state.likedPosts.forEach(liked => {
            if(liked.postId === post._id) {
              liked.status = post.status
              isLikedExist = true
            }
          })
          if(isLikedExist === false) state.likedPosts.push({ postId: post._id, status: post.status })
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
  catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update a post data from Posts Collection`,
      data: err
    })
  }

  // let status

  // return await Likestatus.find({ ipv4: req.body.ipv4 })
  // .then(async data => {
  //   data.likedPosts.map(post => {
  //     if(post.postId === req.body.postId) status = post.status 
  //   })

  //   if(status) return await Post.findByIdAndUpdate(
  //     { _id: req.body.postId },
  //     { $set: { like: +req.body.postLikeCount - 1 } }
  //   )
  //   else return await Post.findByIdAndUpdate(
  //     { _id: req.body.postId },
  //     { $set: { like: +req.body.postLikeCount + 1 } }
  //   )
  // })
  // .then(async data => {
  //   return await Likestatus.updateOne(
  //     { ipv4: req.body.ipv4 },
  //     { $set: { "likedPosts.$[postId].status": !status } },
  //     { arrayFilters: [{ "postId.postId": req.body.postId }] }
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
  //     error: `Failed to update data from Posts & Likestatus Collection`,
  //     data: err
  //   })
  // })
}

// @desc    Portfolio V4 Posts Dashboard (Get All Posts)
// @route   POST /api/v1/posts/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivatePosts = async(req, res, next) => {
  try {
    // get posts, techs, users data from redis
    let redisAllData = await getAllData()
    let posts = redisAllData.posts
    let techs = redisAllData.techs
    let users = redisAllData.users

    // get populated posts (with creator)
    posts.forEach(post => {
      users.forEach(user => {
        if(user._id === post.creator) post.creator = {...user}
      })
    })
    // get populated posts (with tech)
    posts.forEach(post => {
      techs.forEach(tech => {
        if(tech._id === post.tech) post.tech = {...tech}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    })
  }
  catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to get posts data from Posts Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Posts Dashboard (Add A Post)
// @route   POST /api/v1/posts/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivatePost = async(req, res, next) => {
  let {
    title,
    excerpt,
    tech,
    description
  } = req.body

  // get posts & users data from redis
  let redisAllData = await getAllData()
  let posts = redisAllData.posts
  let users = redisAllData.users

  const post = new Post({
    title: title,
    imgSrc: req.file.originalname,
    excerpt: handleNoneInput(excerpt),
    tech: tech,
    description: handleNoneInput(description),
    // publishedAt: new Date('October 3, 2020').toISOString(),
    publishedAt: new Date(Date.now()).toISOString(),
    creator: res.locals.userId // add current logged-in user ID
  })
  
  post.save()
  .then(async data => {
    await User.updateOne(
      { _id: res.locals.userId },
      { $push: { posts: data._id } },
    )

    /** update posts & users redis */
    // add new added data to posts redis
    posts.push(data)
    // set new posts redis
    await setAllPost(posts)
    // add & update new post id to user/creator data
    users.forEach(user => {
      if(user._id === res.locals.userId) user.posts.push(data._id)
    })
    // set new users redis
    await setAllUser(users)
    
    let post = await data.populate('tech').populate('creator').populate('comments').execPopulate()

    return res.status(200).json({
      success: true,
      count: post.length,
      data: post
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to add new post data from Posts Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Posts Dashboard (Update A Post Img)
// @route   POST /api/v1/posts/private/update/image
// @access  Private (Require sessionId & uid)
exports.updatePrivatePostImg = async(req, res, next) => {
  let { postId, imgSrc } = req.body

  // - remove image from server images folder
  handleImgRemove(res, imgSrc)

  // get posts data from redis
  let redisAllData = await getAllData()
  let posts = redisAllData.posts

  await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: { imgSrc: req.file.originalname } },
    { new: true }
  )
  .then(async data => {
    /** update posts redis */
    // update post info
    posts.forEach(state => {
      if(state._id === postId) state.imgSrc = req.file.originalname
    })
    // set new posts redis
    await setAllPost(posts)
    
    let post = await data.populate('tech').populate('creator').populate('comments').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: post.length,
      data: post
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update post image from Posts Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Posts Dashboard (Update A Post Publishment)
// @route   POST /api/v1/posts/private/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivatePostPublish = async(req, res, next) => {
  let { postId, intention } = req.body

  // get posts data from redis
  let redisAllData = await getAllData()
  let posts = redisAllData.posts
  
  await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update posts redis */
    // update post info
    posts.forEach(state => {
      if(state._id === postId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new posts redis
    await setAllPost(posts)

    let post = await data.populate('tech').populate('creator').populate('comments').execPopulate()

    return res.status(200).json({
      success: true,
      count: post.length,
      data: post
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update post publish from Posts Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Posts Dashboard (Update A Post)
// @route   POST /api/v1/posts/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivatePost = async(req, res, next) => {
  let {
    title, excerpt, description, tech, creator
  } = req.body

  // get posts & users data from redis
  let redisAllData = await getAllData()
  let posts = redisAllData.posts
  let users = redisAllData.users
  
  let shouldCreatorUpdate
  creator.current === creator.new ? shouldCreatorUpdate = 'no' : shouldCreatorUpdate = 'yes'
  
  await Post.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: {
      title: title,
      excerpt: handleNoneInput(excerpt),
      description: handleNoneInput(description),
      tech: tech,
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
        { $pull: { posts: req.params.id } },
      )

      // add to new user
      await User.updateOne(
        { _id: creator.new },
        { $push: { posts: req.params.id } },
      )

      /** update users redis */
      // remove from user before
      users.forEach(user => {
        if(user._id === creator.current) {
          let filtered = user.posts.filter(state => state !== req.params.id)
          user.posts = filtered
        }
      })
      // add to new user
      users.forEach(user => {
        if(user._id === creator.new) user.posts.push(req.params.id)
      })
      // set new users redis
      await setAllUser(users)
    }

    /** update posts redis */
    // update post info
    posts.forEach(state => {
      if(state._id === req.params.id) {
        state.title = title
        state.excerpt = handleNoneInput(excerpt)
        state.description = handleNoneInput(description)
        state.tech = tech
        state.creator = shouldCreatorUpdate === 'no' ? creator.current : creator.new
      }
    })
    // set new posts redis
    await setAllPost(posts)

    let post = await data.populate('tech').populate('creator').populate('comments').execPopulate()

    return res.status(200).json({
      success: true,
      count: post.length,
      data: post
    })
  })
  .catch(err => { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to update post data from Posts Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Posts Dashboard (Delete A Post)
// @route   POST /api/v1/posts/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivatePost = async(req, res, next) => {
  try {
    // get posts & users data from redis
    let redisAllData = await getAllData()
    let posts = redisAllData.posts
    let users = redisAllData.users

    // check if post is published first
    let post = posts.find(state => state._id === req.params.id)
    if(post) {
      if(post.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete post! Please unpublished the post first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { posts: req.params.id } },
    )

    // - remove image from server images folder
    handleImgRemove(res, post.imgSrc)

    // delete post
    await Post.deleteOne({ _id: req.params.id })

    /** update posts redis */
    // delete post
    let filtered = posts.filter(state => state._id !== req.params.id)
    // set new posts redis
    await setAllPost(filtered)
    // remove deleted post from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.posts.filter(state => state !== req.params.id)
        user.posts = filtered
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) { console.log(err)
    return res.status(200).json({
      success: false,
      error: `Failed to delete post data from Post Collection`,
      data: err
    })
  }
}