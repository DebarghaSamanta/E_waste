import bcrypt from "bcrypt";
import { User, AdminUser, VendorUser } from "../models/User.js";
import { signJwt } from "../utils/jwt.js";

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] === undefined || obj[f] === null || obj[f] === "") {
      return f;
    }
  }
  return null;
};

export const register = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["admin", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    // Common fields
    const { email, password, whatsapp } = req.body;
    const commonMissing = required({ email, password }, ["email", "password"]);
    if (commonMissing) {
      return res.status(400).json({ message: `${commonMissing} is required` });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    let user;
    if (role === "admin") {
      const { name, department } = req.body;
      const miss = required({ name, department }, ["name", "department"]);
      if (miss) return res.status(400).json({ message: `${miss} is required` });

      user = await AdminUser.create({
        role,
        name,
        email,
        password: hashed,
        whatsapp,
        department,
      });
    } else {
      // vendor
      const {
        address,
        location, // { coordinates: [lng, lat] }
        serviceRadiusKm,
        capacityKgPerDay,
        workingHours, // { start: "09:00", end: "18:00" }
      } = req.body;

      const miss = required(
        { address, location, serviceRadiusKm, capacityKgPerDay, workingHours },
        ["address", "location", "serviceRadiusKm", "capacityKgPerDay", "workingHours"]
      );
      if (miss) return res.status(400).json({ message: `${miss} is required` });

      // Normalize location to GeoJSON Point
      const geo = {
        type: "Point",
        coordinates: location?.coordinates,
      };

      user = await VendorUser.create({
        role,
        email,
        password: hashed,
        whatsapp,
        address,
        location: geo,
        serviceRadiusKm,
        capacityKgPerDay,
        workingHours,
      });
    }

    const token = signJwt({ sub: user._id.toString(), role: user.role });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        department: user.department,
        address: user.address,
        location: user.location,
        serviceRadiusKm: user.serviceRadiusKm,
        capacityKgPerDay: user.capacityKgPerDay,
        workingHours: user.workingHours,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const miss = required({ email, password }, ["email", "password"]);
    if (miss) return res.status(400).json({ message: `${miss} is required` });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt({ sub: user._id.toString(), role: user.role });

    return res.status(200).json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        department: user.department,
        address: user.address,
        location: user.location,
        serviceRadiusKm: user.serviceRadiusKm,
        capacityKgPerDay: user.capacityKgPerDay,
        workingHours: user.workingHours,
      },
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};