const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to database
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Socket.io must be declared before API routes
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  transports: ['polling'],
  cors: { origin: "*" }, 
});
require('./socketio.js')(io);

// This middleware parses incoming requests with JSON payloads
app.use(express.json({ limit: '50mb' }));

// This middleware parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'))

// Serve Frontend
// Set the build folder as a static folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve the React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Custom error handling middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
