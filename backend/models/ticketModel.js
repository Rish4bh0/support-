const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    ticketID: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerContact: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      //required: [true, 'Please select a product'],
      ref: "project",
    },
    priority: {
      type: String,
      enum: ["High", "Low"],
      required: false,
      default: "Low",
    },
    cc: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],

    issueType: {
      type: mongoose.Schema.Types.ObjectId,
      //  required: true,
      ref: "issueType",
    },
    description: {
      type: String,
      required: [true, "Please enter a description of the issue"],
    },
    status: {
      type: String,
      // required: true,
      enum: ["draft", "new", "open", "review", "close"],
      default: "draft",
    },
    closedAt: {
      type: Date,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    mediaUrl: String,

    mediaType: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
