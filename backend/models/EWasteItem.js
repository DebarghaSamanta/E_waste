import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ewasteSchema = new Schema(
  {
    itemName: { type: String, required: true }, // e.g., "Old Laptop"
    description: { type: String },
    category: {
      type: String,
      enum: ["Laptop", "Mobile", "Battery", "Monitor", "Other"],
      required: true,
    },
    weightKg: { type: Number, min: 0 },

    // QR Code unique identifier
    qrCode: { type: String, required: true, unique: true },

    // who reported this item
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // current status
    status: {
      type: String,
      enum: ["reported", "collected", "in-transit", "recycled", "disposed"],
      default: "reported",
    },

    // status history (audit log)
    statusHistory: [
      {
        status: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const EwasteItem = model("EwasteItem", ewasteSchema);
