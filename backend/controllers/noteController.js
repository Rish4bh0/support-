const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private

/**
 * 'asyncHandler' is a simple middleware for handling exceptions
 * inside of async express routes and passing them to your express
 * error handlers.
 */
const getNotes = asyncHandler(async (req, res) => {
  /*
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }*/

  const ticket = await Ticket.findById(req.params.ticketId)
/*
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
*/
  const notes = await Note.find({ ticket: req.params.ticketId })

  res.status(200).json(notes)
})

// @desc    Create ticket note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
/*
const addNote = asyncHandler(async (req, res) => {

  const { text, toTime, fromTime } = req.body;
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)

  if (ticket.assignedTo.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const note = await Note.create({
    ticket: req.params.ticketId,
    text,
    toTime,
    fromTime,
    isStaff: false,
    user: req.user.id
  })

  res.status(200).json(note)
})
*/

const addNote = asyncHandler(async (req, res) => {
  const { text, timeEntries } = req.body; // Assuming timeEntries is an array of objects

  // Get user using the ID and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  if (ticket.assignedTo.toString() !== req.user.id) {
    res.status(401).json({ error: 'User not authorized' });
    return;
  }

  // Create an array of time entries
  const timeEntriesArray = timeEntries.map((entry) => ({
    fromTime: entry.fromTime,
    toTime: entry.toTime,
  }));

  const note = await Note.create({
    ticket: req.params.ticketId,
    text,
    timeEntries: timeEntriesArray,
    isStaff: false,
    user: req.user.id,
  });

  res.status(200).json(note);
});

async function calculateTotalTimeForTicket(ticketId) {
  try {
    // Find all notes associated with the specified ticket ID
    const notes = await Note.find({ ticket: ticketId });

    // Initialize a variable to store the total time
    let totalTicketTime = 0;

    // Iterate through each note and calculate the total time
    notes.forEach((note) => {
      note.timeEntries.forEach((entry) => {
        const fromTime = new Date(entry.fromTime);
        const toTime = new Date(entry.toTime);
        const timeDifference = toTime - fromTime;
        totalTicketTime += timeDifference;
      });
    });

    // Convert the total time to a human-readable format if needed
    const totalTicketTimeInHours = totalTicketTime / (1000 * 60 * 60); // Convert milliseconds to hours

    return totalTicketTimeInHours;
  } catch (error) {
    console.error('Error calculating total time:', error);
    throw error;
  }
}

module.exports = {
  getNotes,
  addNote,
  calculateTotalTimeForTicket
}
