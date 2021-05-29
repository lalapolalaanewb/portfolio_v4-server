/** Dependencies */
// Redis Client
const { redisClient } = require('./redis')
// Express Promisify
const { promisify } = require('util')

/** Redis Promises Function */
// SET ASYNC
const setAsync = promisify(redisClient.set).bind(redisClient)
// GET ASYNC
const getAsync = promisify(redisClient.get).bind(redisClient)
// DELETE ASYNC
const delAsync = promisify(redisClient.del).bind(redisClient)

/** Redis Promises Exports */
module.exports = {
    setAsync,
    getAsync,
    delAsync
}