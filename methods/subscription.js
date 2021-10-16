/** Dependencies */
// Model - Project
const {
  Subscription
} = require('../models')
// Controller
const {
  // Gmail
  subsAutoReplyClientNoty,
  subsAutoReplyAdminNoty,
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
    contacts: redisAllData.contactsRedis,
    subs: redisAllData.subscriptionsRedis,
    users: redisAllData.usersRedis
  }
}
// set new subscriptions redis data
const setAllSubscription = async(redisAllSubscription) => {
  await setAsync(`pfv4_subscriptions`, JSON.stringify(redisAllSubscription))
}

/** Methods */
// @desc    Portfolio V4 Subscription (Add A Subscription)
// @route   POST /api/v1/subscriptions/public/add
// @access  Public (Only need Admin Public Access Key)
exports.addPublicSubscription = async (req, res, next) => {
  let {
    subscriber
  } = req.body; console.log(req.body)

  // get subscriptions & users data from redis
  let redisAllData = await getAllData()
  let contacts = redisAllData.contacts
  let subs = redisAllData.subs
  let users = redisAllData.users
  
  // return message
  let clientResMsg = '', adminResMsg = ''
  
  // get contact info (active user)
  let creator = users.find(user => user.status === 1)
  if(!creator) return res.status(200).json({
    success: false,
    error: `Something went wrong. Please refresh the page and try again later.`,
    data: {}
  }) 
  let contact = contacts.find(state => state.creator === creator._id)

  // send noty to client (from)
  let clientMailResponse = await subsAutoReplyClientNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      email: subscriber,
    }
  )
  // throw error if email noty sent unsuccessful
  if(clientMailResponse === 'Unsuccessful!') clientResMsg = ' Failed sending mail noty to your email.'

  // send noty to admin (to)
  let adminMailResponse = await subsAutoReplyAdminNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      name: creator.name.firstName + ' ' + creator.name.lastName,
      email: creator.credentials.emails.main
    },
    {
      email: subscriber,
    }
  )
  // throw error if email noty sent unsuccessful
  if(adminMailResponse === 'Unsuccessful!') adminResMsg = ' Failed sending mail noty to admin email.'

  // create new mail
  const newMail = new Subscription({
    fromWho: subscriber,
    statusNoty: clientMailResponse === 'Unsuccessful!' ? 0 : 1,
    subsTo: creator
  })

  newMail.save()
  .then(async data => {
    /** update subs redis */
    // add new added data to subs redis
    subs.push(data)
    // set new subs redis
    await setAllSubscription(subs)

    return res.status(200).json({
      success: true,
      count: 1,
      data: 'Successfully subscribed to our newsletter. Thank you!' + clientResMsg + adminResMsg
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Newsletter mail sending failed. Please try again later.`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Subscription Dashboard (Get All Subscriptions)
// @route   POST /api/v1/subscriptions/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateSubscriptions = async (req, res, next) => {
  // get subs & users data from redis
  let redisAllData = await getAllData()
  let subs = redisAllData.subs
  let users = redisAllData.users

  // get populated subs with users
  subs.forEach(sub => {
    let populatedSubsTo
    users.forEach(user => {
      if(user._id === sub.subsTo) populatedSubsTo = {...user} 
    })
    sub.subsTo = populatedSubsTo
  })
  
  return res.status(200).json({
    success: true,
    count: subs.length,
    data: subs
  })
}

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Noty)
// @route   POST /api/v1/subscriptions/private/update/noty
// @access  Private (Require sessionId & uid)
exports.updatePrivateSubscriptionNoty = async (req, res, next) => {
  let { subId, subscriber, intention } = req.body

  // get contacts & mails data from redis
  let redisAllData = await getAllData()
  let contacts = redisAllData.contacts
  let subs = redisAllData.subs
  let users = redisAllData.users
  
  // return message
  let clientResMsg = '', adminResMsg = ''

  // get contact info (active user)
  let creator = users.find(user => user.status === 1)
  let contact = contacts.find(state => state.creator === creator._id)
  
  // send noty to client (from)
  let clientMailResponse = await subsAutoReplyClientNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      email: subscriber.fromWho
    }
  )
  // throw error if email noty sent unsuccessful
  if(clientMailResponse === 'Unsuccessful!') clientResMsg = ' Failed sending mail noty to client email.'

  // send noty to admin (to)
  let adminMailResponse = await subsAutoReplyAdminNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      name: creator.name.firstName + ' ' + creator.name.lastName,
      email: creator.credentials.emails.main
    },
    {
      email: subscriber.fromWho
    }
  )
  // throw error if email noty sent unsuccessful
  if(adminMailResponse === 'Unsuccessful!') adminResMsg = ' Failed sending mail noty to admin email.'
  
  await Subscription.findByIdAndUpdate(
    { _id: subId },
    {
      $set: {
        statusNoty: (() => clientMailResponse === 'Unsuccessful!' ? 0 : 1)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update subs redis */
    // update sub info
    subs.forEach(state => {
      if(state._id === subId) state.statusNoty = clientMailResponse === 'Unsuccessful!' ? 0 : 1
    })
    // set new subs redis
    await setAllSubscription(subs)

    let sub = await data.populate('subsTo').execPopulate()

    return res.status(200).json({
      success: true,
      count: data.length,
      data: {
        sub: sub,
        message: (() => intention === 'send' ? 'Successully update sub noty status (send).' + clientResMsg + adminResMsg : 'Successully update sub noty status (resend).' + clientResMsg + adminResMsg)()
      }
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update sub status noty from Subscription Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Read)
// @route   POST /api/v1/subscriptions/private/update/read
// @access  Private (Require sessionId & uid)
exports.updatePrivateSubscriptionRead = async (req, res, next) => {
  let { subId, intention } = req.body

  // get subs data from redis
  let redisAllData = await getAllData()
  let subs = redisAllData.subs
  
  await Subscription.findByIdAndUpdate(
    { _id: subId },
    {
      $set: {
        statusRead: (() => intention === 'read' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update subs redis */
    // update sub info
    subs.forEach(state => {
      if(state._id === subId) state.statusRead = intention === 'read' ? 1 : 0
    })
    // set new subs redis
    await setAllSubscription(subs)

    let sub = await data.populate('subsTo').execPopulate()

    return res.status(200).json({
      success: true,
      count: 1,
      data: sub
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update sub status read from Subscription Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Subscription Dashboard (Update A Subscription Status Reply)
// @route   POST /api/v1/subscriptions/private/update/reply
// @access  Private (Require sessionId & uid)
exports.updatePrivateSubscriptionReply = async (req, res, next) => {
  let { subId, intention } = req.body
  
  // get subs data from redis
  let redisAllData = await getAllData()
  let subs = redisAllData.subs

  await Subscription.findByIdAndUpdate(
    { _id: subId },
    {
      $set: {
        statusReply: (() => intention === 'reply' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update subs redis */
    // update sub info
    subs.forEach(state => {
      if(state._id === subId) state.statusReply = intention === 'reply' ? 1 : 0
    })
    // set new subs redis
    await setAllSubscription(subs)

    let sub = await data.populate('subsTo').execPopulate()

    return res.status(200).json({
      success: true,
      count: 1,
      data: sub
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update sub status reply from Subscription Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Subscription Dashboard (Delete A Subscription)
// @route   POST /api/v1/subscriptions/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateSubscription = async (req, res, next) => {
  try {
    // get subs data from redis
    let redisAllData = await getAllData()
    let subs = redisAllData.subs

    // check if sub is reply first
    let sub = subs.find(state => state._id === req.params.id)
    if (sub) {
      if (sub.statusNoty === 0 || sub.statusRead === 0 || sub.statusReply === 0) return res.status(200).json({
        success: false,
        error: `Unable to delete sub! Please update status (noty, read & reply) to read and replied first.`,
        data: {}
      })
    }

    // delete sub
    await Subscription.deleteOne({ _id: req.params.id })

    /** update subs redis */
    // delete sub
    let filtered = subs.filter(state => state._id !== req.params.id)
    // set new subs redis
    await setAllSubscription(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch (err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to delete sub data from Subscription Collection`,
      data: err
    })
  }
}