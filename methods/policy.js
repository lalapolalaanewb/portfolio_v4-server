/** Dependencies */
// Model - User
const {
  Policy
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
    policies: redisAllData.policiesRedis,
    users: redisAllData.usersRedis
  }
}
// set new policies redis data
const setAllPolicy = async(redisAllPolicy) => {
  await setAsync(`pfv4_policies`, JSON.stringify(redisAllPolicy))
}
// handle 'none' input
const handleNoneInput = input => {
  if(input === 'none') return ''
  else return input
}

/** Methods */
// @desc    Portfolio V4 Policy Comment Page
// @route   POST /api/v1/policies/get/comment
// @access  Public (Only need Admin Public Access Key)
exports.getPublicPolicyComment = async(req, res, next) => {
  // get policies data from redis
  let redisAllData = await getAllData()
  let policies = redisAllData.policies

  // get active policy info
  let policy = policies.find(policy => policy.status === 1)
  if(!policy) return res.status(200).json({
    success: false,
    error: `Failed to get active comment policy data.`,
    data: {}
  })

  return res.status(200).json({
    success: true,
    count: 1,
    data: {
      _id: policy._id,
      comment: policy.comment
    }
  })
}

// @desc    Portfolio V4 Policy Dashboard (Get All Policy)
// @route   POST /api/v1/policies/private/get
// @access  Private (Require sessionId & uid)
exports.getPrivatePolicies = async(req, res, next) => {
  try {
    // get policies & users data from redis
    let redisAllData = await getAllData()
    let policies = redisAllData.policies
    let users = redisAllData.users

    // get populated policy info
    policies.forEach(policy => {
      users.forEach(user => {
        if(user._id === policy.creator) policy.creator = {...user}
      })
    })
    
    return res.status(200).json({
      success: true,
      count: policies,
      data: policies.sort((a, b) => a._id > b._id ? -1 : 1)
    })
  }
  catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to get policies data from Policy Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Policy Dashboard (Add A Policy)
// @route   POST /api/v1/policies/private/add
// @access  Private (Require sessionId & uid)
exports.addPrivatePolicy = async(req, res, next) => {
  let {
    name, privacy, comment
  } = req.body
  
  // get policies data from redis
  let redisAllData = await getAllData()
  let policies = redisAllData.policies

  const newPolicy = new Policy({ 
    name: handleNoneInput(name), 
    privacy: handleNoneInput(privacy),
    comment: handleNoneInput(comment),
    creator: res.locals.userId // add current logged-in user ID 
  })
  
  newPolicy.save()
  .then(async data => {
    /** update policies redis */
    // add new added data to policies redis
    policies.push(data)
    // set new policies redis
    await setAllPolicy(policies)

    let policy = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: policy.length,
      data: policy
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to add new policy data from Policy Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Policy Dashboard (Update A Policy)
// @route   POST /api/v1/policies/private/update
// @access  Private (Require sessionId & uid)
exports.updatePrivatePolicy = async(req, res, next) => {
  let {
    policyId, policy
  } = req.body

  // get policies data from redis
  let redisAllData = await getAllData()
  let policies = redisAllData.policies

  await Policy.findByIdAndUpdate(
    { _id: policyId },
    { $set: {
      name: handleNoneInput(policy.name),
      privacy: handleNoneInput(policy.privacy),
      comment: handleNoneInput(policy.comment),
      creator: policy.creator
    } },
    { new: true }
  )
  .then(async data => {
    /** update policies redis */
    // update policy info
    policies.forEach(state => {
      if(state._id === policyId) {
        state.name = handleNoneInput(policy.name)
        state.privacy = handleNoneInput(policy.privacy)
        state.comment = handleNoneInput(policy.comment)
        state.creator = policy.creator
      }
    })
    // set new policies redis
    await setAllPolicy(policies)

    let policyPopulated = await data.populate('creator').execPopulate()

    return res.status(200).json({
      success: true,
      count: policyPopulated.length,
      data: policyPopulated
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to update policy from Policy Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Policy Dashboard (Update A Policy's Publish)
// @route   POST /api/v1/policies/private/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivatePolicyPublish = async(req, res, next) => {
  let { policyId, intention } = req.body

  // get policies data from redis
  let redisAllData = await getAllData()
  let policies = redisAllData.policies
  
  try {
    // check if other policy is published
    let policyActive = policies.find(policy => policy.status === 1)
    if(policyActive) {
      if(policyActive._id.toString() !== policyId) return res.status(200).json({
        success: false,
        error: `Policy ${policyActive.name} still ACTIVE! Please deactivate the policy first.`,
        data: {}
      })
    } 

    let data = await Policy.findByIdAndUpdate(
      { _id: policyId },
      { $set: {
        status: (() => intention === 'publish' ? 1 : 0)()
      } },
      { new: true }
    )

    /** update policies redis */
    // update policy info
    policies.forEach(state => {
      if(state._id === policyId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new policies redis
    await setAllPolicy(policies)

    let policy = await data.populate('creator').execPopulate()
    
    return res.status(200).json({
      success: true,
      count: policy.length,
      data: policy
    })
  } catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to update policy publish from Policy Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Policy Dashboard (Delete A Policy)
// @route   POST /api/v1/policies/private/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivatePolicy = async(req, res, next) => {
  try {
    // get policies data from redis
    let redisAllData = await getAllData()
    let policies = redisAllData.policies

    // check if policy is published first
    let policy = policies.find(policy => policy._id === req.params.id)
    if(policy) {
      if(policy.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete policy! Please unpublished the policy first.`,
        data: {}
      })
    }

    // delete policy
    await Policy.deleteOne({ _id: req.params.id })

    /** update policies redis */
    // delete policy
    let filtered = policies.filter(state => state._id !== req.params.id)
    // set new policies redis
    await setAllPolicy(filtered)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) { 
    return res.status(200).json({
      success: false,
      error: `Failed to delete policy data from Policy Collection`,
      data: err
    })
  }
}