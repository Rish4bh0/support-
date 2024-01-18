// nodemailerMiddleware.js

const nodemailer = require('nodemailer');

// Create a Nodemailer transport using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Export the transporter for use in other modules
module.exports = transporter;


