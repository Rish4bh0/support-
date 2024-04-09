// server.js
const express = require('express');
const multer = require('multer');
require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs').promises; 
const Media = require('./models/mediaModel.js');
const environment = require('./utils/environment.js');
// Connect to the database
connectDB();


const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use("/locales", express.static(path.join(__dirname, "locales")));
// Define a Mongoose schema for media (images and videos)

// Set up Multer for media uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // Set the limit to 10 GB (in bytes)
  },
});

// Middleware to create uploads directory if it doesn't exist
const createUploadsDirectory = async (req, res, next) => {
  const uploadsPath = path.join(__dirname, '../uploads');
  try {
    await fs.mkdir(uploadsPath, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
  next();
};
// Socket.io must be declared before API routes
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  transports: ['polling'],
  cors: { origin: '*' },
});

// Socket.io initialization
require('./socketio.js')(io);

// Middleware for parsing incoming requests with JSON payloads
app.use(express.json({ limit: '50mb' }));

// Middleware for parsing incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to create uploads directory
app.use(createUploadsDirectory);


// API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/project', require('./routes/projectRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.post('/upload', upload.array('media', 10), async (req, res) => {
  try {
    const { ticketID } = req.body; 

    // Ensure ticketID is valid (perform necessary validation)

    // Check if media items already exist for the provided ticketID
    let existingMediaDocument = await Media.findOne({ ticket: ticketID });

    if (!existingMediaDocument) {
      // If no existing media document, create a new one
      existingMediaDocument = await Media.create({
        mediaItems: [],
        ticket: ticketID,
      });
    }

    // Save the media URLs in MongoDB with forward slashes
    const mediaItems = req.files.map((file) => ({

      mediaUrl: environment.SERVER_URL + "/" + file.path.replace(/\\/g, '/'),

      mediaType: file.mimetype.startsWith('image') ? 'image' : 'video',
    }));

    // Update or insert media items in the existing media document
    existingMediaDocument.mediaItems = [...existingMediaDocument.mediaItems, ...mediaItems];
    await existingMediaDocument.save();

    res.json({ mediaUrls: mediaItems.map((item) => item.mediaUrl) });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/media', async (req, res) => {
  try {
    const { ticketID } = req.query;

    // Validate ticketID
    if (!mongoose.isValidObjectId(ticketID)) {
      return res.status(400).json({ error: 'Invalid ticketID' });
    }

    // Query the Media collection to find media items associated with the given ticketID
    const mediaDocument = await Media.findOne({ ticket: ticketID }).populate('ticket');

    if (!mediaDocument) {
      return res.status(404).json({ error: 'Media not found for the specified ticket' });
    }

    const mediaItems = mediaDocument.mediaItems;
    res.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/media/:id', async (req, res) => {
  const mediaItemId = req.params.id;

  try {
    let mediaDocument = await Media.findOne({ 'mediaItems._id': mediaItemId });

    if (!mediaDocument) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    // Find the index of the media item in the array
    const mediaItemIndex = mediaDocument.mediaItems.findIndex(item => item._id == mediaItemId);

    if (mediaItemIndex === -1) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    // Extract the filename from the URL
    const filename = path.basename(mediaDocument.mediaItems[mediaItemIndex].mediaUrl);

    // Construct the local file path for deletion
    const filePath = path.join(__dirname, '../uploads', filename);

    // Delete the media file from the server
    await fs.unlink(filePath);

    // Remove the media item from the array
    mediaDocument.mediaItems.splice(mediaItemIndex, 1);

    // Save the updated document to the database
    await mediaDocument.save();

    res.json({ message: 'Media item deleted successfully' });
  } catch (error) {
    console.error('Error deleting media item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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
