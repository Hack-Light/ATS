const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    12
);

const contestantSchema = new mongoose.Schema(
    {

        ref_no: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "organiser"
        },

        description: {
            type: String,
            required: true
        },

        totalVotes: {
            type: Number,
            default: 0
        },


        is_evicted: { type: Boolean, default: false },


        images: [
            {
                url: String,
                public_id: String
            }
        ],

        category: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("contestants", contestantSchema);
