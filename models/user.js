const mongoose = require("mongoose");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const userSchema = new mongoose.Schema(
  {
    slug: { type: String, default: () => nanoid() },

    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    provider: String,

    providerID: String,

    phone: {
      type: String
    },

    password: {
      type: String
    },

    totalVotes: {
      type: Number,
      default: 0
    },

    activity: {
      type: [{ title: String, date: Date }],
    },

    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user"
    },

    // events: [{ type: mongoose.Schema.Types.ObjectId, ref: "event" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
