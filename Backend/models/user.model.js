const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 3,
      },
      lastname: {
        type: String,
        minlength: 3,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    // PHASE 4: Standardized phone validation (supports international formats)
    phone: {
      type: String,
      minlength: [10, "El número de teléfono debe tener al menos 10 dígitos"],
      maxlength: [15, "El número de teléfono no puede exceder 15 dígitos"],
      match: [/^\d{10,15}$/, "El número de teléfono debe contener solo dígitos (10-15)"],
    },
    socketId: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    // SECURITY: Role-based access control field
    isAdmin: {
      type: Boolean,
      default: false,
    },
    rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
    // Rating statistics
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    // PHASE 4: Saved Locations Feature
    savedLocations: [
      {
        name: {
          type: String,
          required: true,
          maxlength: 100,
        },
        address: {
          type: String,
          required: true,
          maxlength: 500,
        },
        coordinates: {
          lat: {
            type: Number,
            required: true,
          },
          lng: {
            type: Number,
            required: true,
          },
        },
        type: {
          type: String,
          enum: ['home', 'work', 'other'],
          default: 'other',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // PHASE 4: Search History Feature
    searchHistory: [
      {
        query: {
          type: String,
          required: true,
          maxlength: 500,
        },
        coordinates: {
          lat: Number,
          lng: Number,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance optimization
// Index for socket-based user lookups
userSchema.index({ socketId: 1 });

// Email is already unique, but explicit index helps
userSchema.index({ email: 1 });

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, userType: "user" }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
