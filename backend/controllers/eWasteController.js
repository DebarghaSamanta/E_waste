// controllers/ewasteController.js
import { EwasteItem } from '../models/EWasteItem.js';
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

// Register a new e-waste item
export const createEwasteItem = async (req, res) => {
  try {
    const { itemName, description, category, weightKg } = req.body;
    if (!itemName || !category) {
      return res.status(400).json({ message: "itemName and category are required" });
    }

    // Generate unique QR string (UUID)
    const qrString = uuidv4();

    // Generate QR image as Data URL
    const qrCodeImage = await QRCode.toDataURL(qrString);

    const item = await EwasteItem.create({
      itemName,
      description,
      category,
      weightKg,
      qrCode: qrString,
      reportedBy: req.user.sub, // from JWT middleware
      statusHistory: [{ status: "reported", updatedBy: req.user.sub }],
    });

    res.status(201).json({
      message: "E-waste item registered",
      item,
      qrCodeImage, // frontend can display this as <img src={qrCodeImage} />
    });
  } catch (err) {
    console.error("createEwasteItem error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch details by QR code
export const getByQrCode = async (req, res) => {
  try {
    const { qr } = req.params;
    const item = await EwasteItem.findOne({ qrCode: qr }).populate("reportedBy", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(item);
  } catch (err) {
    console.error("getByQrCode error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["collected", "in-transit", "recycled", "disposed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const item = await EwasteItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = status;
    item.statusHistory.push({ status, updatedBy: req.user.sub });
    await item.save();

    res.status(200).json({ message: "Status updated", item });
  } catch (err) {
    console.error("updateStatus error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
