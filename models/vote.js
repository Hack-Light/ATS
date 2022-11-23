const mongoose = require("mongoose");

// const { customAlphabet } = require("nanoid");

// const nanoid = customAlphabet(
//   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
//   6
// );

const voteSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        vote_no: {
            type: Number,
            required: true
        },
        user_id: {
            type: String,
            ref: "user",
            required: true
        },

        username: {
            type: String,
            required: true
        },

        trans_complete: {
            type: Boolean,
            defult: false
        },

        date: {
            type: Date,
            default: Date.now
        },
        trans_ref: {
            type: String,
            required: true,
            unique: true
        },
        contestant_id: {
            type: String,
            required: true
        }

    },

    { timestamps: true }
);

module.exports = mongoose.model("vote", voteSchema);
