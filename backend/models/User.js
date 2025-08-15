import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Common base schema
const userBase = new Schema(
  {
    role: {
      type: String,
      enum: ["admin", "vendor"],
      required: true,
      index: true,
    },
    name: { type: String, trim: true }, // required for admin (validated in controller)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /\S+@\S+\.\S+/, // basic email validation
    },
    password: { type: String, required: true },
    whatsapp: { type: String, trim: true }, // E.164 suggested (e.g., +919876543210)
  },
  { timestamps: true, discriminatorKey: "role" }
);

export const User = model("User", userBase);

// Admin-specific fields
const adminSchema = new Schema(
  {
    department: {
      type: String,
      enum: ["CSE", "IT", "DS", "ECE", "EEE", "ME", "CE", "Other"],
      required: true,
    },
  },
  { _id: false }
);

// Vendor-specific fields
const vendorSchema = new Schema(
  {
    address: { type: String, trim: true, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function (val) {
            return Array.isArray(val) && val.length === 2;
          },
          message: "location.coordinates must be [lng, lat]",
        },
      },
    },
    serviceRadiusKm: { type: Number, min: 0, required: true },
    capacityKgPerDay: { type: Number, min: 0, required: true },
    workingHours: {
  start: {
    type: String, // HH:mm 24h format
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  end: {
    type: String, // HH:mm 24h format
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
},
  },
  { _id: false }
);

export const AdminUser = User.discriminator("admin", adminSchema);

export const VendorUser = User.discriminator("vendor", vendorSchema);

// Geo index for vendor location queries
User.schema.index({ location: "2dsphere" });