const express = require('express') // commonjs module syntax
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
// Connect to database
connectDB()

const app = express()

/**
 * Each app.use(middleware) is called every time
 * a request is sent to the server
 */

/**
 * This is a built-in middleware function in Express.
 * It parses incoming requests with JSON payloads and is based on body-parser.
 */
app.use(express.json({ limit: '50mb' })); // Example: Increase the limit to 10MB
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Routes endpoints

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/organizations', require ('./routes/organizationRoutes'));
// Serve Frontend
/*
  // Set build folder as static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
*/

app.use(errorHandler)

/**
 * app.listen()
 * Starts a UNIX socket and listens for connections on the given path.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
