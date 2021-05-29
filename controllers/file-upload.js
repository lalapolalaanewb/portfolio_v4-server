// Mutler
const multer = require('multer')
// Path
const path = require('path')
// Util
const util = require('util')
// File Remove
const fileRemove = require('fs')

const {
  // File Base FOlder Location
  FILE_BASE_FOLDER_LOCATION = path.resolve(__dirname + '/', '../'),
  // Image Folder Location
  IMAGE_FOLDER_LOCATION = FILE_BASE_FOLDER_LOCATION + '/client/public/images/',
  // Pdf Folder Location
  PDF_FOLDER_LOCATION = FILE_BASE_FOLDER_LOCATION + '/client/public/files/'
} = process.env

// storage img
const storageImgFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_FOLDER_LOCATION)
  },
  filename: (req, file, cb) => {
    // let ext = file.mimetype.split('/')[1]
    cb(null, file.originalname)
    // cb(null, file.originalname + "." + ext)
    // cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '-' + file.originalname)
    // cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '-' + file.originalname + "." + ext)
  }
})

// storage pdf
const storagePdfFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PDF_FOLDER_LOCATION)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// filter img types
const filterImgFile = (req, file, cb) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml']
  
  if(fileTypes.includes(file.mimetype)) cb(null, true)
  else cb('Only .png .jpg .jpeg & image/svg+xml format allowed!', false)
}

// filter multiple img types
const filterMultiImgFile = (req, file, cb) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml']
  
  if(fileTypes.indexOf(file.mimetype) !== -1) cb(null, true)
  else cb('Only .png .jpg .jpeg & image/svg+xml format allowed!', false)
}

// filter pdf types
const filterPdfFile = (req, file, cb) => {
  const fileTypes = ['application/pdf']
  
  if(fileTypes.includes(file.mimetype)) cb(null, true)
  else cb('Only .pdf format allowed!', false)
}

// Img FIle Upload Middleware
const uploadImgFile = multer({
  storage: storageImgFile,
  filterImgFile: filterImgFile
  // limits: { fieldSize: 10000000000 }
})

// Multi Img FIle Upload Middleware
const uploadMultiImgFile = multer({
  storage: storageImgFile,
  filterMultiImgFile: filterMultiImgFile
  // limits: { fieldSize: 10000000000 }
}).array('files', 10)

// Pdf FIle Upload Middleware
const uploadPdfFile = multer({
  storage: storagePdfFile,
  filterPdfFile: filterPdfFile
  // limits: { fieldSize: 10000000000 }
})

// Img Removing Handler
const handleImgRemove = (res, imgSrc) => {
  fileRemove.unlink(IMAGE_FOLDER_LOCATION + imgSrc, async (err) => {
    if(err) {
      return res.status(500).json({
        success: false,
        error: `Failed at removing file from server images folder`,
        data: err
      })
    }
  })
}

// Pdf Removing Handler
const handlePdfRemove = (res, pdfSrc) => {
  fileRemove.unlink(PDF_FOLDER_LOCATION + pdfSrc, async (err) => {
    if(err) {
      return res.status(500).json({
        success: false,
        error: `Failed at removing file from server files folder`,
        data: err
      })
    }
  })
}

module.exports = {
  imgFolderLocation: IMAGE_FOLDER_LOCATION,
  pdfFolderLocation: PDF_FOLDER_LOCATION,
  uploadImgFile: uploadImgFile, 
  uploadMultiImgFile: util.promisify(uploadMultiImgFile),
  uploadPdfFile: uploadPdfFile,
  handleImgRemove: handleImgRemove, 
  handlePdfRemove: handlePdfRemove,
}