/** Dependencies */
// Express
const express = require('express')
const app = express()
// Dotenv
const dotenv = require('dotenv')
dotenv.config()
// Mongoose
const mongoose = require('mongoose')
// Colors
const colors = require('colors')
// Morgan
const morgan = require('morgan')
// Path
const path = require('path')
// Cors
const cors = require('cors')
// File upload
// const fileUpload = require('express-fileupload')
// Controllers
const {
  // Session
  SESS_OPTIONS,
  // Redis
  RedisStore, redisClient, session
} = require('./controllers')

/** Global Middlewares */
// Colors
app.use(cors())
// JSON Body Parser
// - for fetch call
app.use(express.json())
// - for form input
app.use(express.urlencoded({ extended: false }))
// File Upload
// app.use(fileUpload())
// Session Setup
app.use(session({
  store: new RedisStore({ client: redisClient }),
  ...SESS_OPTIONS
}))

/** Conditional Global Middlewares */
// Morgan Console/Server Status
app.use(morgan('dev'))
// if(process.env.NODE_ENV === 'development') { app.use(morgan('dev')) }
// Static Folder
// if(process.env.NODE_ENV === 'production') {
//   // set static folder
//   app.use(express.static('client/build'))
//   // re-route everything to homepage (any other routes other than declared in Routes Middlewares)
//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
// }

/** Routes Middlewares */
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/dashboard', require('./routes/dashboard'))
app.use('/api/v1/contacts', require('./routes/contact'))
app.use('/api/v1/mails', require('./routes/mail'))
app.use('/api/v1/medias', require('./routes/media'))
app.use('/api/v1/mediasocials', require('./routes/mediaSocial'))
app.use('/api/v1/policies', require('./routes/policy'))
app.use('/api/v1/posts', require('./routes/post'))
app.use('/api/v1/projects', require('./routes/project'))
app.use('/api/v1/skills', require('./routes/skill'))
app.use('/api/v1/subscriptions', require('./routes/subscription'))
app.use('/api/v1/techs', require('./routes/tech'))
app.use('/api/v1/users', require('./routes/user'))

/** Database Connection & Server Startup */
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
)
.then(response => {
  console.log(`Succesfully connected to db at ${response.connection.host}`.green.bold)
  app.listen(process.env.PORT || 5400, console.log(`Server is up & running at PORT ${process.env.PORT}`.green.bold))
})
.catch(err => console.log({ message: `Trouble connecting to db`.red.bold, err: err }))