/** Dependencies */
// Model - Project
const {
  Contact, Mail, User
} = require('../models')
// Controller
const {
  // Gmail
  contactAutoReplyClientNoty,
  contactAutoReplyAdminNoty,
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
    mails: redisAllData.mailsRedis,
    users: redisAllData.usersRedis
  }
}
// set new contacts redis data
const setAllContact = async(redisAllContact) => {
  await setAsync(`pfv4_contacts`, JSON.stringify(redisAllContact))
}
// set new mails redis data
const setAllMail = async(redisAllMail) => {
  await setAsync(`pfv4_mails`, JSON.stringify(redisAllMail))
}

/** Methods */
// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/mails/public/get/status
// @access  Public (Only need Admin Public Access Key)
exports.getPublicContactStatus = async (req, res, next) => {
  // get users & jobs data from redis
  let redisAllData = await getAllData()
  let contacts = redisAllData.contacts
  let users = redisAllData.users

  // get active user info
  let user = users.find(user => user.status === 1)
  
  // get active contact info
  let contact = contacts.find(state => state.creator === user._id)
  if(!contact) return res.status(400).json({
    success: false,
    error: `Failed to get active user contact status data.`,
    data: {}
  })

  return res.status(200).json({
    success: true,
    count: 1,
    data: {
      _id: contact._id,
      status: contact.status
    }
  })
}

// @desc    Portfolio V4 Posts (Get All Posts)
// @route   POST /api/v1/mails/public/add
// @access  Public (Only need Admin Public Access Key)
exports.addPublicMail = async (req, res, next) => {
  let {
    mail, contactId
  } = req.body

  // get contacts & mails data from redis
  let redisAllData = await getAllData()
  let contacts = redisAllData.contacts
  let mails = redisAllData.mails
  let users = redisAllData.users
  
  // return message
  let clientResMsg = '', adminResMsg = ''

  // get contact info (active user)
  let contact = contacts.find(state => state._id === contactId)
  let creator = users.find(user => user._id === contact.creator)

  // send noty to client (from)
  let clientMailResponse = await contactAutoReplyClientNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      name: mail.fromWho,
      email: mail.fromTo,
      concerns: mail.fromConcerns,
      subject: mail.fromSubject,
      message: mail.fromMessage
    }
  )
  // throw error if email noty sent unsuccessful
  if(clientMailResponse === 'Unsuccessful!') clientResMsg = ' Failed sending mail noty to your email.'

  // send noty to admin (to)
  let adminMailResponse = await contactAutoReplyAdminNoty(
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
      name: mail.fromWho,
      email: mail.fromTo,
      concerns: mail.fromConcerns,
      subject: mail.fromSubject,
      message: mail.fromMessage
    }
  )
  // throw error if email noty sent unsuccessful
  if(adminMailResponse === 'Unsuccessful!') adminResMsg = ' Failed sending mail noty to admin email.'

  // create new mail
  const newMail = new Mail({
    fromWho: mail.fromWho,
    fromTo: mail.fromTo,
    fromConcerns: mail.fromConcerns.join(', '),
    fromSubject: mail.fromSubject,
    fromMessage: mail.fromMessage,
    statusNoty: clientMailResponse === 'Unsuccessful!' ? 0 : 1
  })

  newMail.save()
  .then(async data => {
    // save newly created mail in Contact
    await Contact.updateOne(
      { _id: contactId },
      { $push: { mails: data._id } },
    )

    /** update contacts & mails redis */
    // add new added data to mails redis
    mails.push(data)
    // set new mails redis
    await setAllMail(mails)
    // add & update new mail id to contact data
    contacts.forEach(state => {
      if(state._id === contactId) state.mails.push(data._id)
    })
    // set new contacts redis
    await setAllContact(contacts)

    return res.status(200).json({
      success: true,
      count: 1,
      data: 'Successfully send the mail.' + clientResMsg + adminResMsg
    })
  })
  .catch(err => { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Mail sending failed. Please try again later.`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Mail Dashboard (Get All Mails)
// @route   POST /api/v1/mails/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateMails = async (req, res, next) => {
  try {  
    // get users & jobs data from redis
    let redisAllData = await getAllData()
    let contacts = redisAllData.contacts
    let mails = redisAllData.mails
    
    // get user contact info
    let contact = contacts.find(state => state.creator === req.session.userId)
    if(!contact) return res.status(400).json({
      success: false,
      error: `Failed to get active user contact data from Contact Collection`,
      data: {}
    })

    // get populated contact with mails
    let populatedMails = []
    contact.mails.forEach(mailInContact => {
      mails.forEach(mail => {
        if(mail._id === mailInContact) populatedMails.push({...mail}) 
      })
    })
    contact.mails = populatedMails
    
    return res.status(200).json({
      success: true,
      count: 1,
      data: contact
    })
  }
  catch(err) { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to get mails from Mail Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Noty)
// @route   POST /api/v1/mails/private/update/noty
// @access  Private (Require sessionId & uid)
exports.updatePrivateMailNoty = async (req, res, next) => {
  let { contactId, mailId, mail, intention } = req.body

  // get contacts & mails data from redis
  let redisAllData = await getAllData()
  let contacts = redisAllData.contacts
  let mails = redisAllData.mails
  let users = redisAllData.users
  
  // return message
  let clientResMsg = '', adminResMsg = ''

  // get contact info (active user)
  let contact = contacts.find(state => state._id === contactId)
  let creator = users.find(user => user._id === contact.creator)
  
  // send noty to client (from)
  let clientMailResponse = await contactAutoReplyClientNoty(
    {
      userGmail: contact.senderGmail,
      userEmail: contact.senderEmail,
      clientId: contact.clientId,
      clientSecret: contact.clientSecret,
      refreshToken: contact.refreshToken
    },
    {
      name: mail.fromWho,
      email: mail.fromTo,
      concerns: mail.fromConcerns.split(','),
      subject: mail.fromSubject,
      message: mail.fromMessage
    }
  )
  // throw error if email noty sent unsuccessful
  if(clientMailResponse === 'Unsuccessful!') clientResMsg = ' Failed sending mail noty to client email.'

  // send noty to admin (to)
  let adminMailResponse = await contactAutoReplyAdminNoty(
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
      name: mail.fromWho,
      email: mail.fromTo,
      concerns: mail.fromConcerns.split(','),
      subject: mail.fromSubject,
      message: mail.fromMessage
    }
  )
  // throw error if email noty sent unsuccessful
  if(adminMailResponse === 'Unsuccessful!') adminResMsg = ' Failed sending mail noty to admin email.'
  
  await Mail.findByIdAndUpdate(
    { _id: mailId },
    {
      $set: {
        statusNoty: (() => clientMailResponse === 'Unsuccessful!' ? 0 : 1)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update mails redis */
    // update mail info
    mails.forEach(state => {
      if(state._id === mailId) state.statusNoty = clientMailResponse === 'Unsuccessful!' ? 0 : 1
    })
    // set new mails redis
    await setAllMail(mails)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: {
        mail: data,
        message: (() => intention === 'send' ? 'Successully update mail noty status (send).' + clientResMsg + adminResMsg : 'Successully update mail noty status (resend).' + clientResMsg + adminResMsg)()
      }
    })
  })
  .catch(err => { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to update mail status noty from Mail Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Read)
// @route   POST /api/v1/mails/private/update/read
// @access  Private (Require sessionId & uid)
exports.updatePrivateMailRead = async (req, res, next) => {
  let { mailId, intention } = req.body

  // get mails data from redis
  let redisAllData = await getAllData()
  let mails = redisAllData.mails
  
  await Mail.findByIdAndUpdate(
    { _id: mailId },
    {
      $set: {
        statusRead: (() => intention === 'read' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update mails redis */
    // update mail info
    mails.forEach(state => {
      if(state._id === mailId) state.statusRead = intention === 'read' ? 1 : 0
    })
    // set new mails redis
    await setAllMail(mails)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to update mail status read from Mail Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Mail Dashboard (Update A Mail Status Reply)
// @route   POST /api/v1/mails/private/update/reply
// @access  Private (Require sessionId & uid)
exports.updatePrivateMailReply = async (req, res, next) => {
  let { mailId, intention } = req.body
  
  // get mails data from redis
  let redisAllData = await getAllData()
  let mails = redisAllData.mails

  await Mail.findByIdAndUpdate(
    { _id: mailId },
    {
      $set: {
        statusReply: (() => intention === 'reply' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update mails redis */
    // update mail info
    mails.forEach(state => {
      if(state._id === mailId) state.statusReply = intention === 'reply' ? 1 : 0
    })
    // set new mails redis
    await setAllMail(mails)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { console.log(err)
    return res.status(500).json({
      success: false,
      error: `Failed to update mail status reply from Mail Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Mail Dashboard (Delete A Mail)
// @route   POST /api/v1/mails/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateMail = async (req, res, next) => {
  try {
    // get contacts & mails data from redis
    let redisAllData = await getAllData()
    let contacts = redisAllData.contacts
    let mails = redisAllData.mails

    // check if mail is reply first
    let mail = mails.find(state => state._id === req.params.id)
    if (mail) {
      if (mail.statusNoty === 0 || mail.statusRead === 0 || mail.statusReply === 0) return res.status(400).json({
        success: false,
        error: `Unable to delete mail! Please update status (noty, read & reply) to read and replied first.`,
        data: {}
      })
    }

    // delete from Contact
    await Contact.updateOne(
      { _id: req.body.contact },
      { $pull: { mails: req.params.id } },
    )

    // delete mail
    await Mail.deleteOne({ _id: req.params.id })

    /** update mails redis */
    // delete mail
    let filtered = mails.filter(state => state._id !== req.params.id)
    // set new mails redis
    await setAllMail(filtered)
    // remove deleted mail from contacts
    contacts.forEach(contact => {
      if(contact._id === req.body.contact) {
        let filtered = contact.mails.filter(state => state !== req.params.id)
        contact.mails = filtered
      }
    })
    // set new contacts redis
    await setAllContact(contacts)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch (err) { 
    return res.status(500).json({
      success: false,
      error: `Failed to delete mail data from Mail Collection`,
      data: err
    })
  }
}