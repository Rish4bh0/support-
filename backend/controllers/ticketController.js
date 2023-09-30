const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const cloudinary = require("../config/cloudinary");
// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private

/**
 * 'asyncHandler' is a simple middleware for handling exceptions
 * inside of async express routes and passing them to your express
 * error handlers.
 */
const getTickets = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ assignedTo: req.user._id });

  res.status(200).json(tickets);
});

// @desc    Get all tickets
// @route   GET /api/tickets/all
// @access  Private (assuming this route is also protected)

const getAllTickets = asyncHandler(async (req, res) => {
  // Get all tickets in the database
  const allTickets = await Ticket.find({});

  res.status(200).json(allTickets);
});

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
 const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  res.status(200).json(ticket);
});

// @desc    Create new ticket
// @route   POST /api/ticket
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const {
    product,
    priority,
    issueType,
    assignedTo,
    description,
    customerName,
    customerEmail,
    customerContact,
    media, // Expect an array of mixed media data (images and videos)
  } = req.body;

  if (
    !product ||
    !priority ||
    !issueType ||
    !assignedTo ||
    !description ||
    !customerName ||
    !customerEmail ||
    !customerContact
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  try {
    const mediaPromises = [];

    for (const mediaItem of media) {
      let result;

      if (mediaItem.startsWith("data:image")) {
        // Handle image upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: "image", // Specify that you're uploading an image
          folder: "tickets/images", // Store images in a different folder
        });
      } else if (mediaItem.startsWith("data:video")) {
        // Handle video upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: "video", // Specify that you're uploading a video
          folder: "tickets/videos", // Store videos in a different folder
        });
      } else {
        // Handle unsupported media type (you can customize this part)
        throw new Error("Unsupported media type");
      }

      mediaPromises.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const ticket = await Ticket.create({
      product,
      priority,
      issueType,
      assignedTo,
      description,
      customerName,
      customerEmail,
      customerContact,
      user: req.user.id,
      status: "new",
      media: mediaPromises, // Store the array of media data (images and videos)
    });

    res.status(201).json(ticket);
  } catch (error) {
    // Handle any errors that occur during user, media, or ticket creation
    res.status(500).json({ error: "Ticket creation failed" });
  }
});




// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await ticket.remove();

  res.status(200).json({ success: true });
});
/*
// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  
 
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

    // Check if the request includes a status update
    if (req.body.status === 'close') {
      // Set the 'closedAt' field to the current date and time
      req.body.closedAt = new Date();
    }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  )

  res.status(200).json(updatedTicket)
})

*/
/*
// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const updatedTicketData = req.body;

  // Check if the request includes media updates
  if (updatedTicketData.media && updatedTicketData.media.length > 0) {
    const mediaPromises = [];

    for (const mediaItem of updatedTicketData.media) {
      let result;

      if (mediaItem.startsWith('data:image')) {
        // Handle image upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: 'image', // Specify that you're uploading an image
          folder: 'tickets/images', // Store images in a different folder
        });
      } else if (mediaItem.startsWith('data:video')) {
        // Handle video upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: 'video', // Specify that you're uploading a video
          folder: 'tickets/videos', // Store videos in a different folder
        });
      } else {
        // Handle unsupported media type (you can customize this part)
        res.status(400);
        throw new Error('Unsupported media type');
      }

      mediaPromises.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Update the updatedTicketData's media with the new media information
    updatedTicketData.media = mediaPromises;
  }

  // Use findByIdAndUpdate to update the ticket with the new data
  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    updatedTicketData,
    {
      new: true,
    }
  );

  if (!updatedTicket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.status(200).json(updatedTicket);
});
*/

const updateTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;
  const updatedTicketData = req.body;

  // Check if the request includes media updates
  if (updatedTicketData.media && updatedTicketData.media.length > 0) {
    const mediaPromises = [];

    for (const mediaItem of updatedTicketData.media) {
      let result;

      if (mediaItem.startsWith('data:image')) {
        // Handle image upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: 'image', // Specify that you're uploading an image
          folder: 'tickets/images', // Store images in a different folder
        });
      } else if (mediaItem.startsWith('data:video')) {
        // Handle video upload
        result = await cloudinary.uploader.upload(mediaItem, {
          resource_type: 'video', // Specify that you're uploading a video
          folder: 'tickets/videos', // Store videos in a different folder
        });
      } else {
        // Handle unsupported media type (you can customize this part)
        res.status(400);
        throw new Error('Unsupported media type');
      }

      mediaPromises.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Update the updatedTicketData's media with the new media information
    updatedTicketData.media = mediaPromises;
  } else {
    // If there is no media in the request, retain the old media in the updatedTicketData
    const existingTicket = await Ticket.findById(ticketId);
    updatedTicketData.media = existingTicket.media;
  }

    // Check if the request includes a status update
    if (req.body.status === 'close') {
      // Set the 'closedAt' field to the current date and time
      req.body.closedAt = new Date();
    }

  // Use findByIdAndUpdate to update the ticket with the new data
  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    updatedTicketData,
    {
      new: true,
    }
  );

  if (!updatedTicket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.status(200).json(updatedTicket);
});


module.exports = {
  getTickets,
  getAllTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
 
};
