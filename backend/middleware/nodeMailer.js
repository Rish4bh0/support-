// nodemailerMiddleware.js

const nodemailer = require('nodemailer');

// Create a Nodemailer transport using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'helpdeskx1122@gmail.com',
    pass: 'zvlf hvcf cewl pzge',
  },
});

// Export the transporter for use in other modules
module.exports = transporter;


