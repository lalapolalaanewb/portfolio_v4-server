/** Env Vars */
// Session Lifetime (Cookie age)
const ONE_HOUR = 1000 * 60 * 60
// Forced Logout Timeout
const SESS_ABSOULTE_TIMEOUT = ONE_HOUR * 5

const {
    // Project Status
    NODE_ENV = process.env.NODE_ENV,
    // Session Name
    SESS_NAME = 'sid',
    // Session Secret
    SESS_SECRET = process.env.SESS_SECRET,
    // Session Lifetime (Cookie maxAge)
    SESS_LIFETIME = ONE_HOUR
} = process.env

// Check Project Status
const IN_PROD = NODE_ENV === 'production'

/** Exports Env */
module.exports = {
    // Session Name
    SESS_NAME: SESS_NAME,
    // Session Absolute Timeout
    SESS_ABSOULTE_TIMEOUT: SESS_ABSOULTE_TIMEOUT,
    // Session Options
    SESS_OPTIONS: {
        // Session Name
        name: SESS_NAME,
        // Session Resave
        resave: false,
        // Sessin Rolling
        rolling: true,
        // Session SaveUnitialized
        saveUninitialized: false,
        // Session Secret
        secret: SESS_SECRET,
        // Cookie Options
        cookie: {
            // Cookie Lifetime (maxAge)
            maxAge: SESS_LIFETIME,
            // Cookie Samesite
            sameSite: true,
            // Cookie Secure
            secure: IN_PROD
        }
    }
}