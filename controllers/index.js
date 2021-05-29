/** Imports */
// Auth Session
const { logIn, logOut, forcedLogout } = require('./auth-session')
// File Upload
const { 
  imgFolderLocation, pdfFolderLocation, 
  uploadImgFile, uploadMultiImgFile, uploadPdfFile, 
  handleImgRemove, handlePdfRemove
} = require('./file-upload')
// Gmail
const {
  contactAutoReplyClientNoty,
  contactAutoReplyAdminNoty,
  subsAutoReplyClientNoty,
  subsAutoReplyAdminNoty
} = require('./gmail')
// Redis
const { RedisStore, redisClient, session } = require('./redis')
// Redis Data
const {
  getDefaultAllData, setDefaultAllData, resetDefaultAllData
} = require('./data-session')
// Redis Promises
const {
  getAsync, setAsync, delAsync
} = require('./redis-promises')
// Session
const { SESS_NAME, SESS_ABSOULTE_TIMEOUT, SESS_OPTIONS } = require('./session')
// Verification
const { redirect2Login, redirect2Home, userIsAuthenticated, userIsActive, adminAccessPublic } = require('./verification')
// Validation
const { registerValidation } = require('./validation')

/** Exports */
module.exports = {
  // Auth Session
  logIn, logOut, forcedLogout,
  // File Upload
  imgFolderLocation, pdfFolderLocation, 
  uploadImgFile, uploadMultiImgFile, uploadPdfFile, 
  handleImgRemove, handlePdfRemove,
  // Gmail
  contactAutoReplyClientNoty,
  contactAutoReplyAdminNoty,
  subsAutoReplyClientNoty,
  subsAutoReplyAdminNoty,
  // Redis
  RedisStore, redisClient, session,
  // Redis data
  getDefaultAllData, setDefaultAllData, resetDefaultAllData,
  // Redis Promises
  getAsync, setAsync, delAsync,
  // Session
  SESS_NAME, SESS_ABSOULTE_TIMEOUT, SESS_OPTIONS,
  // Verification
  redirect2Login, redirect2Home, userIsAuthenticated, userIsActive, adminAccessPublic,
  // Validation
  registerValidation,
}