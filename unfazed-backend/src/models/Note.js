const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
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
    sessionNumber: {
      type: String,
      default: "Session 1",
      trim: true,
    },
    sessionDate: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    preview: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Draft"],
      default: "Completed",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate preview from content before saving if not explicitly set
noteSchema.pre("save", function () {
  if (!this.preview && this.content) {
    this.preview =
      this.content.length > 90
        ? this.content.substring(0, 90) + "..."
        : this.content;
  }
});

module.exports = mongoose.model("Note", noteSchema);
