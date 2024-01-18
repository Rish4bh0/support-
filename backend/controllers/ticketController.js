const asyncHandler = require("express-async-handler");
const Organization = require('../models/organizationModel');
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const cloudinary = require("../config/cloudinary");
const transporter = require ('../middleware/nodeMailer')
const Note = require('../models/noteModel');
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

const getTicketss = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user: req.user._id });

  res.status(200).json(tickets);
});

// @desc    Get all tickets
// @route   GET /api/tickets/all
// @access  Private (assuming this route is also protected)

const getAllTickets = asyncHandler(async (req, res) => {
  /*
  // Get user using the id and JWT
   const user = await User.findById(req.user.id);

   if (!user) {
     res.status(401);
     throw new Error("User not found");
   }
  */
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



/*
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
    organization,
    media, // Expect an array of mixed media data (images and videos)
  } = req.body;

  if (
    !product ||
    !priority ||
    !issueType ||
    !description 
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
      media: mediaPromises,
      organization 
    });

    
   /*

    // Send email to logged-in user
    const userEmail = user.email; // Assuming you have an 'email' field in your User model
    const ticketId = ticket._id; // Retrieve the ticket ID
    const ticketLink = `https://supportdesk-1eot.onrender.com/ticket/${ticketId}`;
    await transporter.sendMail({
      from: 'helpdeskx1122@gmail.com', // Replace with your Gmail email address
      to: userEmail,
      subject: 'Ticket Created',
      html: `<p style="text-align: left;">Dear ${user.name},</p>
      <p style="text-align: left;">A request for support has been created and assigned (ID: ${ticketId})  A reppresentative will follow-up with you as soon as possible. You can <a href="${ticketLink}">link</a> to view this ticket's progress online</p>
      <p style="text-align: left;">Best Regards,</p>`,
    });

    // Retrieve the email address of the assignedTo user
    const assignedToUser = await User.findById(assignedTo);

    if (!assignedToUser) {
      res.status(400);
      throw new Error('Assigned user not found');
    }

    const assignedToEmail = assignedToUser.email; // Assuming you have an 'email' field in your User model

    // Send email to assignedTo user
    await transporter.sendMail({
      from: 'helpdeskx1122@gmail.com', // Replace with your Gmail email address
      to: assignedToEmail,
      subject: 'New Ticket Assignment',
      html: `<p style="text-align: left;">Dear ${assignedToUser.name},</p>
        <p style="text-align: left;">You have been assigned a new ticket (ID: ${ticketId}). Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
        <p style="text-align: left;">Best Regards,</p>`,
    });
    

    res.status(201).json(ticket);
  } catch (error) {
    // Handle any errors that occur during user, media, or ticket creation
    res.status(500).json({ error: "Ticket creation failed" });
  }
});
*/

const createTicket = asyncHandler(async (req, res) => {
  const {
    project,
    priority,
    issueType,
    assignedTo,
    description,
    customerName,
    customerEmail,
    customerContact,
    organization,
    //media,
    title,
    status
  } = req.body;
/*
  if (!product || !priority || !issueType || !description) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }*/

  try {

    {/*
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
  */}
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Define the assignedToUser variable to be used later
    let assignedToUser = null;
   let org = null;

    if (assignedTo) {
      assignedToUser = await User.findById(assignedTo);

      if (!assignedToUser) {
        res.status(400);
        throw new Error('Assigned user not found');
      }
    }

    if (organization) {
      // Assuming you have an "Organization" model, you can fetch the organization.
      org = await Organization.findById(organization);

      if (!org) {
        res.status(400);
        throw new Error('Organization not found');
      }
    }

    const ticket = await Ticket.create({
      project,
      priority: priority || "Low",
      issueType: issueType || null,
      assignedTo: assignedToUser ? assignedToUser.id : null,
      description,
      customerName,
      customerEmail,
      customerContact,
      user: req.user.id,
      status,
      //media: mediaPromises,
      organization: org ? org._id : null,
      title
    });

    

    // Send email to logged-in user
    const userEmail = user.email; // Assuming you have an 'email' field in your User model
    const ticketId = ticket._id; // Retrieve the ticket ID
    const ticketLink = `https://nea-support.onrender.com/ticket/${ticketId}`;

    await transporter.sendMail({
      from: 'helpdeskx1122@gmail.com', // Replace with your Gmail email address
      to: userEmail,
      subject: 'Ticket Created',
      html: `<p style="text-align: left;">Dear ${user.name},</p>
      <p style="text-align: left;">A request for support has been created and assigned (ID: ${ticketId})  A reppresentative will follow-up with you as soon as possible. You can <a href="${ticketLink}">link</a> to view this ticket's progress online</p>
      <p style="text-align: left;">Best Regards,</p>`,
    });
    // Send email to the assignedTo user if provided
    if (assignedToUser) {
      const assignedToEmail = assignedToUser.email; // Assuming you have an 'email' field in your User model
      await transporter.sendMail({
        from: 'helpdeskx1122@gmail.com', // Replace with your Gmail email address
        to: assignedToEmail,
        subject: 'New Ticket Assignment',
        html: `<p style="text-align: left;">Dear ${assignedToUser.name},</p>
          <p style="text-align: left;">You have been assigned a new ticket (ID: ${ticketId}). Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
          <p style="text-align: left;">Best Regards,</p>`,
      });
    }

   

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
{/*
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
*/}

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



const report = async (req, res) => {
  try {
    const notes = await Note.find().populate({
      path: 'ticket',
      populate: {
        path: 'organization', // Populate the organization field in the Ticket model
      },
    });

    const totalTimeSpentPerTicket = {};

    // Iterate through the notes and calculate total time spent for each closed ticket in hours
    for (const note of notes) {
      const ticket = note.ticket; // Access the populated ticket details
      const ticketId = ticket._id.toString(); // Convert ObjectId to string

      // Check if the status is "close"
      if (ticket.status === 'close') {
        const timeEntries = note.timeEntries;

        let totalSpent = 0;

        timeEntries.forEach((entry) => {
          const toTime = new Date(entry.toTime);
          const fromTime = new Date(entry.fromTime);
          const entryTimeSpent = toTime - fromTime;
          totalSpent += entryTimeSpent;
        });

        if (!totalTimeSpentPerTicket[ticketId]) {
          totalTimeSpentPerTicket[ticketId] = {
            totalSpent: 0,
            ticketDetails: ticket,
          };
        }

        totalTimeSpentPerTicket[ticketId].totalSpent += totalSpent;
      }
    }

    // Convert the result to hours and make it always positive
    for (const ticketId in totalTimeSpentPerTicket) {
      totalTimeSpentPerTicket[ticketId].totalSpent = Math.abs(totalTimeSpentPerTicket[ticketId].totalSpent / 3600000);
    }

    res.json(totalTimeSpentPerTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while calculating total time spent for closed tickets.' });
  }
};

/*
const report = async (req, res) => {
  try {
    const notes = await Note.find().populate('ticket'); // Use populate to join the Ticket model

    const totalTimeSpentPerTicket = {};

    // Iterate through the notes and calculate total time spent for each ticket in hours
    notes.forEach((note) => {
      const ticket = note.ticket; // Access the populated ticket details
      const ticketId = ticket._id.toString(); // Convert ObjectId to string
      const timeEntries = note.timeEntries;

      let totalSpent = 0;

      timeEntries.forEach((entry) => {
        const toTime = new Date(entry.toTime);
        const fromTime = new Date(entry.fromTime);
        const entryTimeSpent = toTime - fromTime;
        totalSpent += entryTimeSpent;
      });

      if (!totalTimeSpentPerTicket[ticketId]) {
        totalTimeSpentPerTicket[ticketId] = {
          totalSpent: 0,
          ticketDetails: ticket,
        };
      }

      totalTimeSpentPerTicket[ticketId].totalSpent += totalSpent;
    });

    // Convert the result to hours and make it always positive
    for (const ticketId in totalTimeSpentPerTicket) {
      totalTimeSpentPerTicket[ticketId].totalSpent = Math.abs(totalTimeSpentPerTicket[ticketId].totalSpent / 3600000);
    }

    res.json(totalTimeSpentPerTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while calculating total time spent for all tickets individually.' });
  }
};
*/
/*
const report = async (req, res) => {
  try {
    const notes = await Note.find(); // Retrieve all notes from the database

    const totalTimeSpentPerTicket = {};

    // Iterate through the notes and calculate total time spent for each ticket in hours
    notes.forEach((note) => {
      const ticketId = note.ticket.toString(); // Convert ObjectId to string
      const timeEntries = note.timeEntries;

      let totalSpent = 0;

      timeEntries.forEach((entry) => {
        const toTime = new Date(entry.toTime);
        const fromTime = new Date(entry.fromTime);
        const entryTimeSpent = toTime - fromTime;
        totalSpent += entryTimeSpent;
      });

      if (!totalTimeSpentPerTicket[ticketId]) {
        totalTimeSpentPerTicket[ticketId] = 0;
      }

      totalTimeSpentPerTicket[ticketId] += totalSpent;
    });

    // Convert the result to hours and make it always positive
    for (const ticketId in totalTimeSpentPerTicket) {
      totalTimeSpentPerTicket[ticketId] = Math.abs(totalTimeSpentPerTicket[ticketId] / 3600000);
    }

    res.json(totalTimeSpentPerTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while calculating total time spent for all tickets individually.' });
  }
};

*/

module.exports = {
  getTickets,
  getTicketss,
  getAllTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
  report
 
};
