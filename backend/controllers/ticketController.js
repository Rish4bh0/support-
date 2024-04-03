const asyncHandler = require("express-async-handler");
const Organization = require('../models/organizationModel');
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const cloudinary = require("../config/cloudinary");
const transporter = require ('../middleware/nodeMailer')
const Note = require('../models/noteModel');
const notification = require('../models/notification')
const Project = require('../models/projectModel')
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

async function generateTicketID(organizationId) {
  try {
    // Fetch organization prefix
    const organization = await Organization.findById(organizationId);
    const organizationPrefix = organization.code;
    console.log('Organization Prefix:', organizationPrefix);

    // Fetch the latest ticket for the organization
    const latestTicket = await Ticket.findOne({ organization: organizationId })
      .sort({ ticketID: -1 })
     

    console.log('Latest Ticket:', latestTicket);

    // Initialize or increment the ticket number
    let ticketNumber = 1;

    if (latestTicket && latestTicket.ticketID) {
      const match = latestTicket.ticketID.match(/\d+/);
      const lastTicketNumber = match ? parseInt(match[0], 10) : NaN;

      if (!isNaN(lastTicketNumber)) {
        ticketNumber = lastTicketNumber + 1;
      }
    }

    // Format the ticket ID with prefix and padded ticket number
    const ticketID = `${organizationPrefix}${ticketNumber.toString().padStart(4, '0')}`;
    console.log('Generated Ticket ID:', ticketID);

    return ticketID;
  } catch (error) {
    console.error('Error generating ticket ID:', error);
    throw error;
  }
}




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

const createTicket = asyncHandler(async (req, res) => {
  const {
    project,
    priority,
    issueType,
    assignedTo,
    description,
    cc,
    organization,
    //media,
    title,
    status,
    
  } = req.body;
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const ticketID = await generateTicketID(organization);

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
      ticketID,
      project: project || null,
      priority: priority || "Low",
      issueType: issueType || null,
      assignedTo: assignedToUser ? assignedToUser.id : null,
      description,
      cc: cc || [],
      user: req.user.id,
      status,
      //media: mediaPromises,
      organization: org ? org._id : null,
      title,
   
    });

    

    // Send email to logged-in user
    const userEmail = user.email; // Assuming you have an 'email' field in your User model
    const ticketId = ticket._id; // Retrieve the ticket ID
    const ticketLink = `http://localhost:5000/ticket/${ticketId}`;

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
          <p style="text-align: left;">You have been assigned a new ticket (ID: ${ticketID}). Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
          <p style="text-align: left;">Best Regards,</p>`,
      });

      // add notification for login
  await notification.create({
    user: assignedToUser._id,
    title: 'Ticket Assignment',
    type: 1,
    text: `Ticket assigned at ${new Date()} (ID: ${ticketID})`,
    read: false,
    id: ticketId
  })
    }

    // Send notifications to CC users
    for (const ccUser of cc) {
      const ccUserObject = await User.findById(ccUser);

      if (ccUserObject) {
        const ccUserEmail = ccUserObject.email;

        await transporter.sendMail({
          from: 'helpdeskx1122@gmail.com',
          to: ccUserEmail,
          subject: 'New Ticket CC',
          html: `<p style="text-align: left;">Dear ${ccUserObject.name},</p>
            <p style="text-align: left;">You have been CC'd on a new ticket (ID: ${ticketID}). Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
            <p style="text-align: left;">Best Regards,</p>`,
        });

        // add notification for ccUser
        await notification.create({
          user: ccUserObject._id,
          title: 'New Ticket CC',
          type: 1,
          text: `New ticket CC at ${new Date()} (ID: ${ticketID})`,
          read: false,
          id: ticketId
        });
      }
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



const updateTicket = asyncHandler(async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updatedTicketData = req.body;
    const assignedTo = req.body.assignedTo;
    const cc = req.body.cc; 
    const id = req.body.ticketID;

    let assignedToUser = null;

    if (assignedTo) {
      assignedToUser = await User.findById(assignedTo);

      if (!assignedToUser) {
        res.status(400);
        throw new Error('Assigned user not found');
      }
    }

    const ticketLink = `http://localhost:5000/ticket/${ticketId}`;
    if (assignedToUser) {
      const assignedToEmail = assignedToUser.email;
      await transporter.sendMail({
        from: 'helpdeskx1122@gmail.com',
        to: assignedToEmail,
        subject: 'Ticket Updated',
        html: `<p style="text-align: left;">Dear ${assignedToUser.name},</p>
        <p style="text-align: left;">You have been assigned a new ticket (ID: ${id}). Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
        <p style="text-align: left;">Best Regards,</p>`,
      });

      // add notification for assignedToUser
      await notification.create({
        user: assignedToUser._id,
        title: 'Ticket Assignment',
        type: 1,
        text: `Ticket assigned at ${new Date()} (ID: ${id})`,
        read: false,
      });
    }

    // Check if the request includes a status update
    if (req.body.status === 'close') {
      // Set the 'closedAt' field to the current date and time
      req.body.closedAt = new Date();
    }

    // If cc is provided, update the cc field
    if (cc) {
      // Ensure cc is an array of user ObjectId values
      const ccArray = Array.isArray(cc) ? cc : [cc];

      // Update cc field in the updatedTicketData
      updatedTicketData.cc = ccArray;

      // Send emails and notifications to CC users
      for (const ccUser of ccArray) {
        const ccUserObject = await User.findById(ccUser);

        if (ccUserObject) {
          const ccUserEmail = ccUserObject.email;

          // Send email to CC user
          await transporter.sendMail({
            from: 'helpdeskx1122@gmail.com',
            to: ccUserEmail,
            subject: 'Ticket Updated (CC)',
            html: `<p style="text-align: left;">Dear ${ccUserObject.name},</p>
              <p style="text-align: left;">The ticket (ID: ${id}) has been updated. Please click this <a href="${ticketLink}">link</a> to view the ticket.</p>
              <p style="text-align: left;">Best Regards,</p>`,
          });

          // Add notification for CC user
          await notification.create({
            user: ccUserObject._id,
            title: 'Ticket Update (CC)',
            type: 1,
            text: `Ticket updated at ${new Date()} (ID: ${id})`,
            read: false,
          });
        }
      }
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
  } catch (error) {
    res.status(500).json({ error: 'Ticket update failed' });
  }
});


const report = async (req, res) => {
  try {
    const notes = await Note.find({}).populate({
      path: 'ticket',
      match: { status: 'close' }, // Only populate closed tickets
      populate: [
        {
          path: 'organization',
        },
        {
          path: 'project',
        },
      ],
    });

    const totalTimeSpentPerTicket = {};

    for (const note of notes) {
      const ticket = note.ticket;

      // Check if the ticket is not null before accessing its properties
      if (ticket && ticket._id) {
        const ticketId = ticket._id.toString();

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

    for (const ticketId in totalTimeSpentPerTicket) {
      totalTimeSpentPerTicket[ticketId].totalSpent = Math.abs(totalTimeSpentPerTicket[ticketId].totalSpent / 3600000);
    }

    res.json(totalTimeSpentPerTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while calculating total time spent for closed tickets.' });
  }
};

module.exports = {
  getTickets,
  getTicketss,
  getAllTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
  report,
  generateTicketID
 
};
