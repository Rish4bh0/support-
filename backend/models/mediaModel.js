// mediaModel.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  mediaItems: [
    {
      mediaUrl: String,
      mediaType: String,
    },
  ],
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket', 
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
