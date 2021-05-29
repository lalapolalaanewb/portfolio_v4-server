/** Dependencies */
// Session Vars
const { SESS_NAME, SESS_ABSOULTE_TIMEOUT } = require('./session')

/** Auth Session Functions Handler */
// Assign session to login user
exports.logIn = async(req, userId) => {
  // create userId session
  req.session.userId = userId
  // session createdAt
  req.session.createdAt = Date.now()
  // session createdAt for react
  req.session.createdAtReact = new Date()
}

// Destroy session fror logout user
exports.logOut = async(req, res) => {
  // destroy user session
  req.session.destroy(err => {
    if(err) return res.status(400).json({
      success: false,
      error: `Having touble logging out. Please try again later.`,
      data: {}
    })

    // clear cookie
    res.clearCookie(SESS_NAME)

    // return to login page
    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  })
}

// Forced logout for timeout loged-in user
exports.forcedLogout = async(req, res) => {
  // check if user already logged in
  if(req.session.userId) {
    // get time NOW
    const now = Date.now()
    // get user time when log in
    const { createdAt } = req.session
    // log user out if exceed max timeout
    if(now > createdAt + SESS_ABSOULTE_TIMEOUT) {
      await logOut(req, res)
      return
    }
  }
}