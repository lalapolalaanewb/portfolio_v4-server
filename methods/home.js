/** Dependencies */
// Model - User
const {
  User, Home,
} = require('../models')
// Controllers
const { 
  // File Upload 
  handleImgRemove,
  // Redis Data
  getDefaultAllData,
  // Redis Promises
  setAsync, 
  // uploadImgFile
} = require('../controllers')

// // File 
// const fs = require('fs')
// // Busboy
// const Busboy = require('busboy')
// // Mutler
// const multer = require('multer')
// // Path
// const path = require('path')
// // Util
// const util = require('util')

/** Page Specific Functions */
// get all required data from redis
const getAllData = async() => {
  const redisAllData = await getDefaultAllData()
  return {
    homes: redisAllData.homesRedis,
    users: redisAllData.usersRedis
  }
}
// set new homes redis data
const setAllHome = async(redisAllHome) => {
  await setAsync(`pfv4_homes`, JSON.stringify(redisAllHome))
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
// @desc    Portfolio V4 User Profile (Get A User's Home)
// @route   POST /api/v1/users/private/profile/home/get
// @access  Private (Require sessionId & uid)
exports.getPrivateUserHome = async(req, res, next) => {
  try {
    // get users & homes data from redis
    let redisAllData = await getAllData()
    let users = redisAllData.users
    let homes = redisAllData.homes

    // get active user info
    let user = users.find(user => user.status === 1)
    
    // get all user homes
    let userHomes = homes.filter(state => user.homes.includes(state._id))
    if(!userHomes) return res.status(200).json({
      success: false,
      error: `Failed to get user's homes data from Home Collection`,
      data: {}
    })

    return res.status(200).json({
      success: true,
      count: userHomes.length,
      data: {
        _id: user._id,
        homes: userHomes
      }
    })
  } catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to get homes data from Home Collection`,
      data: err
    })
  }
}

// @desc    Portfolio V4 Users Profile (Add A User's Home)
// @route   POST /api/v1/users/private/profile/home/add
// @access  Private (Require sessionId & uid)
exports.addPrivateUserHome = async(req, res, next) => {
  let {
    topline, headline, description, btnPurpose, btnLabel, btnLink, imgPosition, creator
  } = req.body
  
  // get users & homes data from redis
  let redisAllData = await getAllData()
  let users = redisAllData.users
  let homes = redisAllData.homes

  const home = new Home({
    topline: topline,
    headline: headline,
    description: handleNoneInput(description),
    btnPurpose: btnPurpose,
    btnLabel: btnLabel,
    btnLink: btnLink,
    imgPosition: imgPosition,
    imgSrc: req.file.originalname,
    creator: creator
  })
  
  home.save()
  .then(async data => { 
    await User.findOneAndUpdate(
      { _id: creator },
      { $push: { homes: data._id } },
    )

    /** update homes & users redis */
    // add new added data to homes redis
    homes.push(data)
    // set new homes redis
    await setAllHome(homes)
    // add & update new home id to user/creator data
    users.forEach(user => {
      if(user._id === creator) user.homes.push(data._id)
    })
    // set new users redis
    await setAllUser(users)
    
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => { 
    return res.status(200).json({
      success: false,
      error: `Failed to add new home data from Home Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Home)
// @route   POST /api/v1/users/private/profile/home/update
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserHome = async(req, res, next) => {
  let {
    homeId, home
  } = req.body

  // get users & homes data from redis
  let redisAllData = await getAllData()
  let homes = redisAllData.homes

  await Home.findByIdAndUpdate(
    { _id: homeId },
    { $set: {
      topline: home.topline,
      headline: home.headline,
      description: handleNoneInput(home.description),
      btnPurpose: home.btnPurpose,
      btnLabel: home.btnLabel,
      btnLink: home.btnLink,
      imgPosition: home.imgPosition
    } },
    { new: true }
  )
  .then(async data => {
    /** update homes redis */
    // update home info
    homes.forEach(state => {
      if(state._id === homeId) {
        state.topline = home.topline
        state.headline = home.headline
        state.description = handleNoneInput(home.description)
        state.btnPurpose = home.btnPurpose
        state.btnLabel = home.btnLabel
        state.btnLink = home.btnLink
        state.imgPosition = home.imgPosition
      }
    })
    // set new homes redis
    await setAllHome(homes)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about from Home Collection`,
      data: err
    })
  })
}

// const {
//   // File Base FOlder Location
//   FILE_BASE_FOLDER_LOCATION = path.resolve(__dirname + '/', '../../'),
//   // Image Folder Location
//   IMAGE_FOLDER_LOCATION = FILE_BASE_FOLDER_LOCATION + '/portfolio_v4-next_redux/public/images/',
//   // Pdf Folder Location
//   PDF_FOLDER_LOCATION = FILE_BASE_FOLDER_LOCATION + '/portfolio_v4-next_redux/public/files/'
// } = process.env

// // storage img
// const storageImgFile = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, IMAGE_FOLDER_LOCATION)
//   },
//   filename: (req, file, cb) => { console.log('file: ', file)
//     // let ext = file.mimetype.split('/')[1]
//     cb(null, file.originalname)
//     // cb(null, file.originalname + "." + ext)
//     // cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '-' + file.originalname)
//     // cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '-' + file.originalname + "." + ext)
//   }
// })

// // filter img types
// const filterImgFile = (req, file, cb) => {
//   const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml']
  
//   if(fileTypes.includes(file.mimetype)) cb(null, true)
//   else cb('Only .png .jpg .jpeg & image/svg+xml format allowed!', false)
// }

// // Img FIle Upload Middleware
// const uploadImgFile = multer({
//   storage: storageImgFile,
//   filterImgFile: filterImgFile
//   // limits: { fieldSize: 10000000000 }
// }).single('file')

// const pp = util.promisify(uploadImgFile)

// @desc    Portfolio V4 Users Profile (Update A User's Home Img)
// @route   POST /api/v1/users/private/profile/home/update/image
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserHomeImg = async(req, res, next) => {
  // let homeId, imgSrc, filename2save

  // const busboy = new Busboy({ headers: req.headers })
  // busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
  //   let { homeId, imgSrc } = req.body

  //   console.log('homeId: ', homeId)
  //   console.log('imgSrc: ', imgSrc)
  //   console.log('fieldname: ', fieldname)
  //   console.log('file: ,', file)
  //   console.log('filename: ', filename)
  //   console.log('encoding: ', encoding)
  //   console.log('mimetype: ', mimetype)

  //   const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml']
  
  //   if(!fileTypes.includes(mimetype)) {
  //     file.resume()
  //     return res.status(200).json({
  //       success: false,
  //       error: `Only .png .jpg .jpeg & image/svg+xml format allowed!`,
  //       data: {}
  //     })
  //   }
  //   else {
  //     const saveTo = IMAGE_FOLDER_LOCATION; console.log(saveTo)
  //     file.pipe(fs.createWriteStream(saveTo + filename))

  //     filename2save = filename

  //     // return res.status(200).json({
  //     //   success: true,
  //     //   count: 1,
  //     //   data: {}
  //     // })
  //   }
  // })
  // busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
  //   console.log('1')
  //   console.log('Field [' + fieldname + ']: value: ' + val);

  //   if(fieldname == 'homeId') homeId = val
  //   if(fieldname == 'imgSrc') imgSrc = val
  //   // return res.status(200).json({
  //   //   success: true,
  //   //   count: 1,
  //   //   data: {}
  //   // })
  // })
  // busboy.on('finish', async () => {
  //   // res.writeHead(200, { 'Connection': 'close' })
  //   // res.end("That's all folks!")
  //   // let { homeId, imgSrc } = req.body

  //   console.log('homeId: ', homeId)
  //   console.log('imgSrc: ', imgSrc)

  //   // return res.status(200).json({
  //   //   success: true,
  //   //   count: 1,
  //   //   data: {}
  //   // })

  //   // - remove image from server images folder
  //   handleImgRemove(res, imgSrc)

  //   // get users & homes data from redis
  //   let redisAllData = await getAllData()
  //   let homes = redisAllData.homes

  //   await Home.findByIdAndUpdate(
  //     { _id: homeId },
  //     { $set: { imgSrc: filename2save } },
  //     { new: true }
  //   )
  //   .then(async data => {
  //     /** update homes redis */
  //     // update home info
  //     homes.forEach(state => {
  //       if(state._id === homeId) state.imgSrc = filename2save
  //     })
  //     // set new homes redis
  //     await setAllHome(homes)

  //     return res.status(200).json({
  //       success: true,
  //       count: data.length,
  //       data: data
  //     })
  //   })
  //   .catch(err => {
  //     return res.status(200).json({
  //       success: false,
  //       error: `Failed to update about image from Home Collection`,
  //       data: err
  //     })
  //   })
  // })
  // req.pipe(busboy)

  // return res.status(200).json({
  //   success: true,
  //   count: 1,
  //   data: {}
  // })

  // await pp(req, res, async (err) => {
  //   console.log('req.body: ', req.body)
  //   console.log('req.file: ', req.file)

  //   if(err) console.log('err: ', err)

  //   let { homeId, imgSrc } = req.body

  //   // - remove image from server images folder
  //   handleImgRemove(res, imgSrc)

  //   // get users & homes data from redis
  //   let redisAllData = await getAllData()
  //   let homes = redisAllData.homes

  //   await Home.findByIdAndUpdate(
  //     { _id: homeId },
  //     { $set: { imgSrc: req.file.originalname } },
  //     { new: true }
  //   )
  //   .then(async data => {
  //     /** update homes redis */
  //     // update home info
  //     homes.forEach(state => {
  //       if(state._id === homeId) state.imgSrc = req.file.originalname
  //     })
  //     // set new homes redis
  //     await setAllHome(homes)

  //     return res.status(200).json({
  //       success: true,
  //       count: data.length,
  //       data: data
  //     })
  //   })
  //   .catch(err => {
  //     return res.status(200).json({
  //       success: false,
  //       error: `Failed to update about image from Home Collection`,
  //       data: err
  //     })
  //   })
  // })
  
  let { homeId, imgSrc } = req.body

  // - remove image from server images folder
  handleImgRemove(res, imgSrc)

  // get users & homes data from redis
  let redisAllData = await getAllData()
  let homes = redisAllData.homes

  await Home.findByIdAndUpdate(
    { _id: homeId },
    { $set: { imgSrc: req.file.originalname } },
    { new: true }
  )
  .then(async data => {
    /** update homes redis */
    // update home info
    homes.forEach(state => {
      if(state._id === homeId) state.imgSrc = req.file.originalname
    })
    // set new homes redis
    await setAllHome(homes)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about image from Home Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Update A User's Home Publish)
// @route   POST /api/v1/users/private/profile/home/update/publish
// @access  Private (Require sessionId & uid)
exports.updatePrivateUserHomePublish = async(req, res, next) => {
  let { homeId, intention } = req.body
  
  // get users & homes data from redis
  let redisAllData = await getAllData()
  let homes = redisAllData.homes

  await Home.findByIdAndUpdate(
    { _id: homeId },
    { $set: {
      status: (() => intention === 'publish' ? 1 : 0)()
    } },
    { new: true }
  )
  .then(async data => {
    /** update homes redis */
    // update home info
    homes.forEach(state => {
      if(state._id === homeId) state.status = intention === 'publish' ? 1 : 0
    })
    // set new homes redis
    await setAllHome(homes)

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    })
  })
  .catch(err => {
    return res.status(200).json({
      success: false,
      error: `Failed to update about publish from Home Collection`,
      data: err
    })
  })
}

// @desc    Portfolio V4 Users Profile (Delete A User's Home)
// @route   POST /api/v1/users/private/profile/home/delete
// @access  Private (Require sessionId & uid)
exports.deletePrivateUserHome = async(req, res, next) => {
  try {
    // get users & homes data from redis
    let redisAllData = await getAllData()
    let homes = redisAllData.homes
    let users = redisAllData.users

    // check if home is published first
    let home = homes.find(state => state._id === req.body.homeId)
    if(home) {
      if(home.status === 1) return res.status(200).json({
        success: false,
        error: `Unable to delete home! Please unpublished the home first.`,
        data: {}
      })
    }

    // remove from user
    await User.updateOne(
      { _id: req.body.creator },
      { $pull: { homes: req.body.homeId } },
    )

    // - remove image from server images folder
    handleImgRemove(res, home.imgSrc)

    // delete home
    await Home.deleteOne({ _id: req.body.homeId })

    /** update homes redis */
    // delete home
    let filtered = homes.filter(state => state._id !== req.body.homeId)
    // set new homes redis
    await setAllHome(filtered)
    // remove deleted home from users
    users.forEach(user => {
      if(user._id === req.body.creator) {
        let filtered = user.homes.filter(state => state !== req.body.homeId)
        user.homes = filtered
      }
    })
    // set new users redis
    await setAllUser(users)

    return res.status(200).json({
      success: true,
      count: 0,
      data: {}
    })
  } catch(err) {
    return res.status(200).json({
      success: false,
      error: `Failed to delete home data from Home Collection`,
      data: err
    })
  }
}