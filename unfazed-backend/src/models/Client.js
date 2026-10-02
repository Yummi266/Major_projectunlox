const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        phone: {
            type: String,
            trim: true,
        },

        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            default: null,
        },

        profileImage: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        package: {
            type: String,
            default: "6-pack Care Bundle",
        },

        sessionsUsed: {
            type: Number,
            default: 0,
        },

        totalSessions: {
            type: Number,
            default: 6,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Client", clientSchema);