/** Dependencies */
// Colors
const colors = require('colors') 
// Redis
const redis = require('redis')
// Session
const session = require('express-session')

// Redis Configuration
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

// - check if Redis On
redisClient.on('connect', () => {
    console.log('Redis is ON & successfully connected!'.green.bold)
})

/** Redis Configuration Exports */
module.exports = {
    RedisStore,
    redisClient,
    session
}