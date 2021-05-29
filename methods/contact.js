/** Dependencies */
// Model - Project
const {
  Contact
} = require('../models')
// Controllers
const {
  // Redis Data
  getDefaultAllData,
  // Redis Promises
  setAsync
} = require('../controllers')

/** Page Specific Functions & States */
// get all contact from redis
const getAllContact = async() => {
  const redisAllData = await getDefaultAllData()
  return redisAllData.contactsRedis
}
// set new contacts redis data
const setAllContact = async(redisAllContact) => {
  await setAsync(`pfv4_contacts`, JSON.stringify(redisAllContact))
}

/** Methods */
// @desc    Portfolio V4 Contact Dashboard (Get All Contact)
// @route   POST /api/v1/contacts/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivateContact = async (req, res, next) => {
  try {
    // get contacts data from redis
    let redisAllContact = await getAllContact()
    
    let userContact = redisAllContact.find(contact => contact.creator === req.session.userId)
    if(!userContact) return res.status(400).json({
      success: false,
      error: `Failed to get contact data from Contact Collection`,
      data: {}
    })
    
    return res.status(200).json({
      success: true,
      count: 1,
      data: userContact
    })
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      error: `Failed to get contact data from Contact Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Contact Dashboard (Add Contact)
// @route   POST /api/v1/contacts/private/add/
// @access  Private (Require sessionId & uid)
exports.addPrivateContact = async (req, res, next) => {
  let {
    senderGmail, senderEmail,
    clientId, clientSecret, refreshToken
  } = req.body

  // get contacts data from redis
  let redisAllContact = await getAllContact()
  
  const newContact = new Contact({
    senderGmail: senderGmail,
    senderEmail: senderEmail,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    creator: req.session,userId
  })

  // save new contact
  newContact.save()
  .then(async data => {
    /** update contacts redis */
    // add new added data to contacts redis
    redisAllContact.push(data)
    // set new contacts redis
    await setAllContact(redisAllContact)

    let contact = await data.populate('mails').execPopulate()

    return res.status(200).json({
      success: true,
      count: contact.length,
      data: contact
    })
  })
  .catch(err => {
    return res.status(500).json({
      success: false,
      error: `Failed to add new contact data from Contact Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Contact Dashboard (Update A Contact Status Publish)
// @route   POST /api/v1/contacts/private/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateContactPublish = async (req, res, next) => {
  let { contactId, intention } = req.body
  
  // get contacts data from redis
  let redisAllContact = await getAllContact()

  await Contact.findByIdAndUpdate(
    { _id: contactId },
    {
      $set: {
        status: (() => intention === 'publish' ? 1 : 0)()
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update contacts redis */
    // update contact publish
    redisAllContact.forEach(state => {
      if(state._id === contactId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new contacts redis
    await setAllContact(redisAllContact)

    let contact = await data.populate('mails').execPopulate()

    return res.status(200).json({
      success: true,
      count: contact.length,
      data: contact
    })
  })
  .catch(err => { 
    return res.status(500).json({
      success: false,
      error: `Failed to update contact status publish from Contact Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Contact Dashboard (Update A Contact)
// @route   POST /api/v1/contacts/private/update/:id
// @access  Private (Require sessionId & uid)
exports.updatePrivateContact = async (req, res, next) => {
  let {
    senderGmail, senderEmail,
    clientId, clientSecret, refreshToken
  } = req.body

  // get contacts data from redis
  let redisAllContact = await getAllContact()

  await Contact.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        senderGmail: senderGmail,
        senderEmail: senderEmail,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken
      }
    },
    { new: true }
  )
  .then(async data => {
    /** update contacts redis */
    // update contact info
    redisAllContact.forEach(state => {
      if(state._id === req.params.id) {
        state.senderGmail = senderGmail
        state.senderEmail = senderEmail
        state.clientId = clientId
        state.clientSecret = clientSecret
        state.refreshToken = refreshToken
      }
    })
    // set new contacts redis
    await setAllContact(redisAllContact)

    let contact = await data.populate('mails').execPopulate()

    return res.status(200).json({
      success: true,
      count: contact.length,
      data: contact
    })
  })
  .catch(err => {
    return res.status(500).json({
      success: false,
      error: `Failed to update contact data from Contact Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Contact Dashboard (Delete A Contact)
// @route   POST /api/v1/contacts/private/delete/:id
// @access  Private (Require sessionId & uid)
exports.deletePrivateContact = async (req, res, next) => {
  try {
    // get contacts data from redis
    let redisAllContact = await getAllContact()

    // check if contact is published first
    let contact = redisAllContact.find(contact => contact._id === req.params.id)
    if (contact) {
      if (contact.status === 1) return res.status(400).json({
        success: false,
        error: `Unable to delete contact! Please unpublished the contact first.`,
        data: {}
      })
    }

    // delete post
    await Contact.deleteOne({ _id: req.params.id })

    /** update contacts redis */
    // delete contact
    let filtered = redisAllContact.filter(state => state._id !== req.params.id)
    // set new contacts redis
    await setAllContact(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Failed to delete contact data from Contact Collection`,
      data: err
    })
  }
}