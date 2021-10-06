/** Verification Functions Handler */

const { getAsync } = require("./redis-promises")

// Verify not loggeed-in user
exports.redirect2Login = async(req, res, next) => { // console.log(req.session)
  // if(!req.session.userId) {
  //   console.log('xde session server')
  //   return res.status(401).json({
  //     success: false,
  //     error: `You are not logged-in. Please login to access the data.`,
  //     data: {}
  //   })
  // }

  // check if Authorization header send
  const authHeader = await req.get('Authorization')
  console.log(authHeader)
  if(!authHeader) {
    console.log('xde header Auth')
    return res.status(401).json({
      success: false,
      error: `You are not logged-in. Please login to access the data.`,
      data: {}
    })
  }

  // check if uid exist
  const sessionID = authHeader.split(' ')[1] // Eg- Authorization: Bearer ejyjdgjhdgfd
  if(!sessionID || sessionID === '') {
    console.log('xde token')
    return res.status(401).json({
      success: false,
      error: `You are not logged-in. Please login to access the data.`,
      data: {}
    })
  }

  // continue
  const sessionData = JSON.parse(await getAsync(`sess:${sessionID}`))
  if(sessionData) {
    res.locals.sessionID = sessionID
    res.locals.userId = sessionData?.userId
    return next()
  }
  else {
    return res.status(401).json({
      success: false,
      error: `You are not logged-in. Please login to access the data.`,
      data: {}
    })
  } 
}

// Verify logged-in user
exports.redirect2Home = async(req, res, next) => {
  if(req.session.userId) {
    // check if Authorization header send
    const authHeader = await req.get('Authorization')
    console.log(authHeader)
    if(!authHeader) {
      console.log('xde header Auth')
      return res.status(401).json({
        success: false,
        error: `You are not logged-in. Please login to access the data.`,
        data: {}
      })
    }

    // check if uid exist
    const uid = authHeader.split(' ')[1] // Eg- Authorization: Bearer ejyjdgjhdgfd
    if(!uid || uid === '') {
      console.log('xde token')
      return res.status(401).json({
        success: false,
        error: `You are not logged-in. Please login to access the data.`,
        data: {}
      })
    }

    if(req.session.userId === req.body.uid) return res.status(401).json({
      success: false,
      error: `You already logged-in. Cannot access said location/url.`,
      data: {}
    })
  }

  // continue
  next()
} 

// Verify user isAuthenticated
exports.userIsAuthenticated = (req, res) => {
  console.log('in isauth')
  console.log(req.body)
  if(!req.session.userId) return res.status(401).json({
    success: false,
    error: `You are not logged-in yet. Please log in to access the data.`,
    data: {}
  })

  if(req.session.userId === req.body.uid) return res.status(200).json({
    success: true,
    count: 1,
    data: {}
  })
}

// Verify user isActive
exports.userIsActive = (req, res) => {
  console.log('in isactive')
  console.log(req.body)
  if(!req.session.userId) return res.status(401).json({
    success: false,
    error: `You are no longer active. Please log in again.`,
    data: {}
  })

  if(req.session.userId === req.body.uid) return res.status(200).json({
    success: true,
    count: 1,
    data: {}
  })
}

/** Access (FOr Commented Users' only) */
exports.adminAccessPublic = (req, res, next) => {
  if(req.body.key !== process.env.ADMIN_ACCESS_PUBLIC) { 
    if(process.env.NODE_ENV === 'production') return res.redirect('/projects')

    return res.status(401).json({
      success: false,
      error: `Having problem accessing the server. Please try again later.`,
      data: []
    })
  }

  // continue
  next()
}