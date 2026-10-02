const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      default: null,
    },
    sender: {
      type: String,
      enum: ["therapist", "client"],
      required: true,
      default: "therapist",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
